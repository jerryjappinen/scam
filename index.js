// Deps
const _ = require('lodash')
const chalk = require('chalk')
const cors = require('cors')
const express = require('express')
const nocache = require('nocache')

// App
const resources = require('./schema')
const routes = require('./src/routes')
const db = require('./src/select')

// Setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())

// Routes
routes.setRoot(app)
routes.setGetList(app)
routes.setGetById(app)

// Start app
app.listen(app.get('port'), function() {
	console.log('Node app is running on port ' + app.get('port') + '!' + '\n');

	// Show URL of each list endpoints
	console.log(chalk.blue('http://localhost:' + app.get('port')));
	for (let key in resources) {
		console.log(chalk.blue('http://localhost:' + app.get('port') + '/' + resources[key].plural));
		console.log(chalk.blue('http://localhost:' + app.get('port') + '/' + resources[key].plural + '/:id'));
	}

})
