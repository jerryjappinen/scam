const insert = require('../db/insert')

module.exports = function (crude) {

	for (let resourceType in crude.schema) {
		let resource = crude.schema[resourceType]

		// Register post endpoint
		crude.app.post('/' + resource.plural, function (request, response) {
			let values = {}
			for (let requestKey in request.body) {
				values[requestKey] = request.body[requestKey]
			}

			insert.one(crude.dbPath, crude.schema, resourceType, values).then(function (newRowId) {

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
