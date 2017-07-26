const normalizeRequestParamatersForInput = require('../helpers/normalizeRequestParamatersForInput')

const fail = require('../response/fail')
const success = require('../response/success')

const exists = require('../db/exists')
const select = require('../db/select')
const update = require('../db/update')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		let handler = function (request, response) {

			const requestedId = parseInt(request.params.id)

			const message404 = 'A ' + resource.singular + ' with the requested ID ' + requestedId + ' does not exist'
			const message500 = 'Something went wrong when updating this resource.'

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

					// Normalize input sent
					let valuesToInsert = normalizeRequestParamatersForInput(request.body, resource.fields)

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
								message500,
								[
									'select.one(...).catch()',
									error
								]
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
							message500,
							[
								'update.one(...).catch()',
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

		}

		// Register update endpoint
		// NOTE: we do this for convenience, but it's not really correct
		scam.app.patch('/' + resource.plural + '/:id', handler)
		scam.app.put('/' + resource.plural + '/:id', handler)

	}

}
