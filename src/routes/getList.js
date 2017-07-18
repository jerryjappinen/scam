const select = require('../select')

// Generate list endpoints in a loop
module.exports = function (app, dbPath, schema) {

	for (let resourceType in schema) {
		let resource = schema[resourceType]

		// Register list getter endpoint
		app.get('/' + resource.plural, function (request, response) {

			select.all(dbPath, schema, resourceType).then(function (rows) {

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
