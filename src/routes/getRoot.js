const _ = require('lodash')

// Root
module.exports = function (app, schema) {

	app.get('/', function (request, response) {
		response.status(200).json({
			status: 200,
			body: {
				message: 'Hello world!',
				schema: _.keys(schema)
			}
		})
	})

}
