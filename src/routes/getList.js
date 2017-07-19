const _ = require('lodash')

const config = require('../config')
const select = require('../db/select')

// Generate list endpoints in a loop
module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register list getter endpoint
		scam.app.get('/' + resource.plural, function (request, response) {

			// Use query parameters to filter list
			// NOTE: would it be better to not loop all query params here?
			let where = {}
			for (let key in request.query) {
				if (!_.includes(config.reservedParameterNames, key)) {
					where[key] = request.query[key]
				}
			}

			// Fetch items from database
			select.all(
				scam.dbPath,
				scam.schema,
				resourceType,
				where,
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
