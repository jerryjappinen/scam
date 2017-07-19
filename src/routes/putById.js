const select = require('../db/select')
const update = require('../db/update')

module.exports = function (scam) {

	// Send out error response
	const fail = function (response, error) {
		response.status(500).json({
			status: 500,
			timestamp: new Date(),
			message: error.message
		})
	}

	// Send out success response
	const succeed = function (response, body) {
		response.status(200).json({
			status: 200,
			timestamp: new Date(),
			body: body
		})
	}

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register update endpoint
		scam.app.put('/' + resource.plural + '/:id', function (request, response) {

			let values = {}
			for (let requestKey in request.body) {
				values[requestKey] = request.body[requestKey]
			}

			// Update the database
			update.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				parseInt(request.params.id),
				values
			).then(function (id) {

				// Select the updated object
				select.one(
					scam.dbPath,
					scam.schema,
					resourceType,
					parseInt(request.params.id),
					false

				).then(function (row) {
					succeed(response, row)

				}).catch(function (error) {
					fail(response, error)
				})

			}).catch(function (error) {
				fail(response, error)
			})

		})

	}

}
