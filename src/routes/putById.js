const fail = require('../response/fail')
const success = require('../response/success')

const exists = require('../db/exists')
const select = require('../db/select')
const update = require('../db/update')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register update endpoint
		scam.app.put('/' + resource.plural + '/:id', function (request, response) {

			let requestedId = parseInt(request.params.id)

			// Fetch supported values from request body
			// FIXME: should be helper
			let valuesToInsert = {}
			for (let fieldName in resource.fields) {
				if (typeof request.body[fieldName] !== 'undefined') {
					valuesToInsert[fieldName] = request.body[fieldName]
				}
			}

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
					update.one(
						scam.dbPath,
						scam.schema,
						resourceType,
						requestedId,
						valuesToInsert

					// Updating was successful
					).then(function (id) {

						// fetch the updated object
						select.one(
							scam.dbPath,
							scam.schema,
							resourceType,
							id,
							false

						// Success response
						).then(function (row) {
							success(
								scam,
								resourceType,
								request,
								response,
								200,
								row
							)

						// Could not fetch the updated object
						}).catch(function (error) {
							fail(
								scam,
								resourceType,
								request,
								response,
								500,
								error
							)
						})

					// Something went wrong when doing the update
					}).catch(function (error) {
						fail(
							scam,
							resourceType,
							request,
							response,
							500,
							error
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
						'A ' + resource.singular + ' with the requested ID ' + requestedId + ' does not exist'
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
					error
				)

			})

		})

	}

}
