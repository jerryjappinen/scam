const fail = require('../response/fail')
const success = require('../response/success')

const insert = require('../db/insert')
const select = require('../db/select')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Insert response handler
		let handler = function (request, response) {

			// Fetch supported values from request body
			// FIXME: should be helper
			let valuesToInsert = {}
			for (let fieldName in resource.fields) {
				if (typeof request.body[fieldName] !== 'undefined') {
					valuesToInsert[fieldName] = request.body[fieldName]
				}
			}

			// Insert new object
			insert.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				valuesToInsert

			// After insert...
			).then(function (newRowId) {

				// Fetch the inserted object
				select.one(
					scam.dbPath,
					scam.schema,
					resourceType,
					newRowId,
					false

				// Send success response with the newly created object
				).then(function (row) {
					success(
						scam,
						resourceType,
						request,
						response,
						201,
						row
					)

				// Could not fetch the new object
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

			// Something went wrong when doing the insert
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

		}

		// Register update endpoints
		// NOTE: we do this for convenience, but it's not really correct
		scam.app.patch('/' + resource.plural, handler)
		scam.app.post('/' + resource.plural, handler)

	}

}
