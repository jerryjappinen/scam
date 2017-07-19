module.exports = function (scam) {

	scam.app.get('/', function (request, response) {
		response.status(200).json({
			status: 200,
			body: {
				message: 'Hello world!',
				endpoints: scam.endpoints,
				resources: scam.schema.resourceTypes
			}
		})
	})

}
