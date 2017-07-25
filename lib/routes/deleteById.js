const fail = require('../response/fail')
const success = require('../response/success')

const exists = require('../db/exists')
const remove = require('../db/remove')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register delete endpoint
		scam.app.delete('/' + resource.plural + '/:id', function (request, response) {

			const requestedId = parseInt(request.params.id)

			const message404 = 'A ' + resource.singular + ' with the requested ID ' + requestedId + ' does not exist'
			const message500 = 'Something went wrong when removing this resource.'

			// Check if resource is there for updating
			exists.where(
				scam.dbPath,
				scam.schema,
				resourceType,
				{
					id: requestedId
				}

			// Query successful
			).then(function (exists) {

				// Resource exists, we can update
				if (exists) {

					// Update the database
					remove.one(
						scam.dbPath,
						scam.schema,
						resourceType,
						requestedId

					// Success response
					).then(function (id) {
						success(
							scam,
							resourceType,
							request,
							response,
							200,
							{}
						)

					// Error response
					}).catch(function (error) {
						fail(
							scam,
							resourceType,
							request,
							response,
							500,
							message500,
							[
								'remove.one(...).catch()',
								error
							]
						)

					})

				// The resource with the requested ID doesn't exist, so it can't be updated
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

			// Check failed, this is an internal error
			}).catch(function (error) {
				fail(
					scam,
					resourceType,
					request,
					response,
					500,
					message500,
					[
						'exists.where(...).catch()',
						error
					]
				)

			})

		})

	}

}
