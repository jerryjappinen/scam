const _ = require('lodash')

const resources = require('../schema')
const db = require('./select')


module.exports = {

	// Root
	setRoot: function (app) {

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
	setGetList: function (app) {

		for (let key in resources) {
			let resource = resources[key]

			// Register list getter endpoint
			app.get('/' + resource.plural, function (request, response) {

				db.selectAll(key).then(function (rows) {

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

	setGetById: function (app) {

		for (let key in resources) {
			let resource = resources[key]

			// Register ID getter endpoint
			app.get('/' + resource.plural + '/:id', function (request, response) {

				db.select(key, request.param('id')).then(function (row) {

					// Send out success response
					response.status(200).json({
						status: 200,
						timestamp: new Date(),
						body: row
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
