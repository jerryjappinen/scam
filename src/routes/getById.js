const select = require('../db/select')

module.exports = function (root) {

	for (let resourceType in root.schema) {
		let resource = root.schema[resourceType]

		// Register ID getter endpoint
		root.app.get('/' + resource.plural + '/:id', function (request, response) {

			select.one(
				root.dbPath,
				root.schema,
				resourceType,
				parseInt(request.params.id),
				request.query.nest ? true : false
			).then(function (row) {

				if (row) {

					// Send out success response
					response.status(200).json({
						status: 200,
						timestamp: new Date(),
						body: row
					})

				} else {

					// Not found
					response.status(404).json({
						status: 404,
						timestamp: new Date(),
						body: 'A ' + resource.singular + ' with the ID ' + request.params.id + ' could not be found.'
					})

				}

			}).catch(function (error) {

				// Send out error response
				// FIXME: hardcoded 500, c'mon!!
				response.status(500).json({
					status: 500,
					timestamp: new Date(),
					message: error.message
				})

			})

		})

	}

}
