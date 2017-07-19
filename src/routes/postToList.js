const insert = require('../db/insert')
const select = require('../db/select')

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
		response.status(201).json({
			status: 201,
			timestamp: new Date(),
			body: body
		})
	}

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register post endpoint
		scam.app.post('/' + resource.plural, function (request, response) {

			// Fetch supported values from request body
			// FIXME: this is the same as sending the whole body in?
			let values = {}
			for (let requestKey in request.body) {
				values[requestKey] = request.body[requestKey]
			}

			// Insert new object
			insert.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				values
			).then(function (newRowId) {

				// Fetch the inserted object
				select.one(
					scam.dbPath,
					scam.schema,
					resourceType,
					newRowId,
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
