const fail = require('../response/fail')
const success = require('../response/success')
const select = require('../db/select')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register ID getter endpoint
		scam.app.get('/' + resource.plural + '/:id', function (request, response) {

			// Find element from database
			select.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				parseInt(request.params.id),
				request.query.nest ? true : false

			).then(function (row) {

				// Send out success response
				if (row) {
					success(
						scam,
						resourceType,
						response,
						200,
						row
					)

				// Not found
				} else {
					fail(
						scam,
						resourceType,
						response,
						404,
						'A ' + resource.singular + ' with the ID ' + request.params.id + ' could not be found.'
					)

				}

			// Something else went wrong
			}).catch(function (error) {
				fail(
					scam,
					resourceType,
					response,
					500,
					error
				)

			})

		})

	}

}
