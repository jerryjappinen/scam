const update = require('../db/update')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register update endpoint
		scam.app.put('/' + resource.plural + '/:id', function (request, response) {

			let values = {}
			for (let requestKey in request.body) {
				values[requestKey] = request.body[requestKey]
			}

			update.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				parseInt(request.params.id),
				values
			).then(function (row) {

				// Send out success response
				response.status(200).json({
					status: 200,
					timestamp: new Date(),
					body: row
				})

			}).catch(function (error) {

				// Send out error response
				response.status(500).json({
					status: 500,
					timestamp: new Date(),
					message: error.message
				})

			})

		})

	}

}
