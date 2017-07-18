const _ = require('lodash')

const resources = require('../schema')
const db = require('./db')

module.exports = {

	// Root
	getRoot: function (app) {

		app.get('/', function (request, response) {
			response.status(200).json({
				status: 200,
				body: {
					message: 'Hello world!',
					resources: _.keys(resources)
				}
			})
		})

		return this
	},

	// Generate list endpoints in a loop
	getList: function (app) {

		for (let resourceType in resources) {
			let resource = resources[resourceType]

			// Register list getter endpoint
			app.get('/' + resource.plural, function (request, response) {

				db.selectAll(resourceType).then(function (rows) {

					// Send out success response
					response.status(200).json({
						status: 200,
						length: rows.length,
						timestamp: new Date(),
						body: rows
					})

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

		return this
	},

	getById: function (app) {

		for (let resourceType in resources) {
			let resource = resources[resourceType]

			// Register ID getter endpoint
			app.get('/' + resource.plural + '/:id', function (request, response) {

				db.select(resourceType, request.params.id).then(function (row) {

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

		return this
	},

	postToList: function (app) {

		for (let resourceType in resources) {
			let resource = resources[resourceType]

			// Register post endpoint
			app.post('/' + resource.plural, function (request, response) {

				let values = {};
				for (let requestKey in request.body) {
					values[requestKey] = request.body[requestKey]
				}

				db.insertOne(resourceType, values).then(function (newRowId) {

					// Send out success response
					response.status(201).json({
						status: 201,
						timestamp: new Date(),
						body: newRowId
					})

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

		return this
	}

}
