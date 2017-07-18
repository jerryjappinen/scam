// Deps
const express = require('express')

// Middleware
const cors = require('cors')
const nocache = require('nocache')

// App
const schema = require('./schema')
const crude = require('./src/routes')

// Setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())

// Crude
crude.init(app)

// Start app with some debug info
const chalk = require('chalk')
app.listen(app.get('port'), function() {
	let url = 'http://localhost:' + app.get('port') + '/'
	console.log('\n' + 'Crude API is now running with these endpoints:' + '\n')

	// Show URL of each list endpoints
	console.log(chalk.blue('\tGET       ') + url + '/')
	for (let key in schema) {
		let path = schema[key].plural
		console.log(chalk.blue('\tGET       ') + url + path)
		console.log(chalk.blue('\tGET       ') + url + path + '/:id')
		console.log(chalk.green('\tPOST      ') + url + path)
		console.log(chalk.green('\tPUT       ') + url + path)
		console.log(chalk.yellow('\tDELETE    ') + url + path)
		console.log()
	}

})
