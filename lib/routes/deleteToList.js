const _ = require('lodash')

const fail = require('../response/fail')
const success = require('../response/success')

const remove = require('../db/remove')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Insert response handler
		let handler = function (request, response) {
			const message500 = 'Something went wrong when removing these resources.'

			let idsToRemove = request.body

			// Normalize one ID
			if (_.isInteger(idsToRemove)) {
				idsToRemove = [idsToRemove]
			}

			// Insert many
			if (_.isArray(idsToRemove)) {

				// Remove objects
				remove.many(
					scam.dbPath,
					scam.schema,
					resourceType,
					idsToRemove

				// After remove...
				).then(function () {

					// Items were removed
					// FIXME: will never report 404 or distinguish between IDs found or not found
					success(
						scam,
						resourceType,
						request,
						response,
						200,
						{}
					)

				// Something went wrong when doing the removal
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
					'Please remove multiple resources by sending an array of IDs.'
				)
			}

		}

		// Register delete endpoints
		scam.app.delete('/' + resource.plural, handler)

	}

}
