const remove = require('../db/remove')

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

		// Register delete endpoint
		scam.app.delete('/' + resource.plural + '/:id', function (request, response) {

			// Update the database
			remove.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				parseInt(request.params.id)
			).then(function (id) {
				succeed(response, {})

			}).catch(function (error) {
				fail(response, error)
			})

		})

	}

}
