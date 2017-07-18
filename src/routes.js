const _ = require('lodash')
const bodyParser = require('body-parser')

const schema = require('../schema')
const select = require('./select')
const insert = require('./insert')

module.exports = {

	init: function (app) {
		this.prepareApp(app).initRoutes(app)
	},

	prepareApp: function (app) {
		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded({
			extended: true
		}))
		return this
	},

	initRoutes: function (app) {
		this.initGetRoot(app)
			.initGetById(app)
			.initGetList(app)
			.initPostToList(app)
	},



	// Routes

	// Root
	initGetRoot: function (app) {

		app.get('/', function (request, response) {
			response.status(200).json({
				status: 200,
				body: {
					message: 'Hello world!',
					schema: _.keys(schema)
				}
			})
		})

		return this
	},

	// Generate list endpoints in a loop
	initGetList: function (app) {

		for (let resourceType in schema) {
			let resource = schema[resourceType]

			// Register list getter endpoint
			app.get('/' + resource.plural, function (request, response) {

				select.all(resourceType).then(function (rows) {

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

	initGetById: function (app) {

		for (let resourceType in schema) {
			let resource = schema[resourceType]

			// Register ID getter endpoint
			app.get('/' + resource.plural + '/:id', function (request, response) {

				select.one(resourceType, request.params.id).then(function (row) {

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

	initPostToList: function (app) {

		for (let resourceType in schema) {
			let resource = schema[resourceType]

			// Register post endpoint
			app.post('/' + resource.plural, function (request, response) {
				let values = {}
				for (let requestKey in request.body) {
					values[requestKey] = request.body[requestKey]
				}

				insert.one(resourceType, values).then(function (newRowId) {

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
