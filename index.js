// Deps
const _ = require('lodash')
const chalk = require('chalk')
const cors = require('cors')
const express = require('express')
const nocache = require('nocache')

// App
const resources = require('./resources')
const helpers = require('./helpers')



// Setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())



// Routes

// Root
app.get('/', function (request, response) {
	response.status(200).json({
		status: 200,
		body: {
			message: 'Hello world!',
			resources: _.keys(resources)
		}
	})
})

// Generate list endpoints in a loop
for (let key in resources) {
	let resource = resources[key]

	// Register list getter endpoint
	app.get('/' + resource.plural, function (request, response) {

		helpers.getAll(key).then(function (rows) {

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

	// Register ID getter endpoint
	app.get('/' + resource.plural + '/:id', function (request, response) {

		helpers.get(key, request.param('id')).then(function (row) {

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



// Start app
app.listen(app.get('port'), function() {
	console.log('Node app is running on port ' + app.get('port') + '!' + '\n');

	// Show URL of each list endpoints
	for (let key in resources) {
		console.log(chalk.blue('http://localhost:' + app.get('port') + '/' + resources[key].plural));
		console.log(chalk.blue('http://localhost:' + app.get('port') + '/' + resources[key].plural + '/:id'));
	}

})
