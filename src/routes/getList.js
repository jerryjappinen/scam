const select = require('../db/select')

// Generate list endpoints in a loop
module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register list getter endpoint
		scam.app.get('/' + resource.plural, function (request, response) {

			select.all(
				scam.dbPath,
				scam.schema,
				resourceType,
				{},
				request.query.nest ? true : false,
				request.query.sort ? request.query.sort.split(',') : []
			).then(function (rows) {

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
