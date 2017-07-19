module.exports = function (root) {

	root.app.get('/', function (request, response) {
		response.status(200).json({
			status: 200,
			body: {
				message: 'Hello world!',
				endpoints: root.endpoints,
				schema: root.schema
			}
		})
	})

}
