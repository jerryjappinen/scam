const _ = require('lodash')

// Root
module.exports = function (crude) {

	crude.app.get('/', function (request, response) {
		response.status(200).json({
			status: 200,
			body: {
				message: 'Hello world!',
				endpoints: crude.endpoints,
				schema: crude.schema
			}
		})
	})

}
