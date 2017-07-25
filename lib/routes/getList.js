const _ = require('lodash')

const fail = require('../response/fail')
const success = require('../response/success')

const config = require('../config')
const select = require('../db/select')

// Generate list endpoints in a loop
module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register list getter endpoint
		scam.app.get('/' + resource.plural, function (request, response) {

			const message500 = 'Something went wrong when looking for these resources.'

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
				success(
					scam,
					resourceType,
					request,
					response,
					200,
					rows
				)

			// Something else went wrong
			}).catch(function (error) {
				fail(
					scam,
					resourceType,
					request,
					response,
					500,
					message500,
					error
				)

			})

		})

	}

}
