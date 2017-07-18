const select = require('../select')

module.exports = function (crude) {

	for (let resourceType in crude.schema) {
		let resource = crude.schema[resourceType]

		// Register ID getter endpoint
		crude.app.get('/' + resource.plural + '/:id', function (request, response) {

			select.one(crude.dbPath, crude.schema, resourceType, request.params.id).then(function (row) {

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
				response.status(500).json({
					status: 500,
					timestamp: new Date(),
					message: error.message
				})

			})

		})

	}

}
