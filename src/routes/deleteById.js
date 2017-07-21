const fail = require('../response/fail')
const success = require('../response/success')

const remove = require('../db/remove')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Register delete endpoint
		scam.app.delete('/' + resource.plural + '/:id', function (request, response) {

			// Update the database
			remove.one(
				scam.dbPath,
				scam.schema,
				resourceType,
				parseInt(request.params.id)

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
					error
				)

			})

		})

	}

}
