const fail = require('../response/fail')
const success = require('../response/success')

const select = require('../db/select')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register ID getter endpoint
		scam.app.get('/' + resource.plural + '/:id', function (request, response) {

			const requestedId = parseInt(request.params.id)

			const message404 = 'A ' + resource.singular + ' with the requested ID ' + requestedId + ' does not exist'
			const message500 = 'Something went wrong when looking for this resource.'

			// Find element from database
			select.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				requestedId,
				request.query.nest ? true : false

			).then(function (row) {

				// Send out success response
				if (row) {
					success(
						scam,
						resourceType,
						request,
						response,
						200,
						row
					)

				// Not found
				} else {
					fail(
						scam,
						resourceType,
						request,
						response,
						404,
						message404
					)

				}

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
