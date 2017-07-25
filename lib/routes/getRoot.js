const success = require('../response/success')

module.exports = function (scam) {

	// Meta endpoint
	// NOTE: should be OPTIONS?
	scam.app.get('/', function (request, response) {

		// Send out success response
		success(
			scam,
			null,
			request,
			response,
			200,
			{
				endpoints: scam.endpoints,
				resources: scam.schema.resourceTypes
			}
		)

	})

}
