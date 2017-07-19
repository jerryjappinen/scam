const insert = require('../db/insert')

module.exports = function (scam) {

	for (let resourceType in scam.schema) {
		let resource = scam.schema[resourceType]

		// Register post endpoint
		scam.app.post('/' + resource.plural, function (request, response) {
			let values = {}
			for (let requestKey in request.body) {
				values[requestKey] = request.body[requestKey]
			}

			insert.one(scam.dbPath, scam.schema, resourceType, values).then(function (newRowId) {

				// Send out success response
				response.status(201).json({
					status: 201,
					timestamp: new Date(),
					body: newRowId
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
