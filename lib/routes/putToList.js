const _ = require('lodash')

const normalizeRequestParamatersForInput = require('../helpers/normalizeRequestParamatersForInput')

const fail = require('../response/fail')
const success = require('../response/success')

const update = require('../db/update')
const select = require('../db/select')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Insert response handler
		let handler = function (request, response) {
			const message500 = 'Something went wrong when updating these resources.'

			let inputParams = request.body

			// Insert many
			if (_.isArray(inputParams)) {
				let valuesToInsert = []

				// Normalize each array item sent
				for (var i = 0; i < inputParams.length; i++) {
					let values = inputParams[i]
					valuesToInsert.push(

						// The normalisation helper will only include the fields defined in schema
						// ID is an internal field, but we need it for update
						_.merge(
							{
								id: values.id
							},
							normalizeRequestParamatersForInput(values, resource.fields)
						)

					)
				}

				// Update objects with new values
				update.many(
					scam.dbPath,
					scam.schema,
					resourceType,
					valuesToInsert

				// After update...
				).then(function (updatedIds) {

					// Fetch the updated objects
					select.all(
						scam.dbPath,
						scam.schema,
						resourceType,
						{
							id: updatedIds
						},
						false

					// Send success response with the newly created objects
					).then(function (rows) {
						success(
							scam,
							resourceType,
							request,
							response,
							200,
							rows
						)

					// Could not fetch the new objects
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

				// Something went wrong when doing the update
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

			// Bad input
			} else {
				fail(
					scam,
					resourceType,
					request,
					response,
					400,
					'Please update multiple resources by sending an array with the new values, with id included in each object.'
				)
			}

		}

		// Register update endpoints
		// NOTE: we do this for convenience, but it's not really correct
		scam.app.patch('/' + resource.plural, handler)
		scam.app.put('/' + resource.plural, handler)

	}

}
