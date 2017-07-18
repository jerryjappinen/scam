const select = require('../db/select')

// Generate list endpoints in a loop
module.exports = function (crude) {

	for (let resourceType in crude.schema) {
		let resource = crude.schema[resourceType]

		// Register list getter endpoint
		crude.app.get('/' + resource.plural, function (request, response) {

			select.all(crude.dbPath, crude.schema, resourceType).then(function (rows) {

				// Send out success response
				response.status(200).json({
					status: 200,
					length: rows.length,
					timestamp: new Date(),
					body: rows
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
