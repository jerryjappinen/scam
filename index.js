const config = require('./crude.json')

// Treat paths
const path = require('path')
const dataPath = path.resolve(__dirname, config.data)
const schemaPath = path.resolve(__dirname, config.schema)
const dbPath = path.resolve(__dirname, config.db)

// Deps
const express = require('express')
const crude = require('./src')

// Optional middleware
const cors = require('cors')
const nocache = require('nocache')

// Setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())

// Set up crude
crude.init(app, dbPath, schemaPath, dataPath)

// Specific command set
let command = process.argv[2]
if (command) {

	switch (command) {

	case 'clear':
		crude.clearDatabase()
		break

	case 'init':
		crude.setupDatabase()
		break

	case 'load':
		crude.loadData()
		break

	// case 'reload':
	// 	crude.clearDatabase()
	// 	crude.setupDatabase()
	// 	crude.loadData()
	// 	break

	default:
		console.log('Unsupported command passed. Try "clear", "init" or "load"')
		break

	}

} else {

	// Start app with some debug info
	const chalk = require('chalk')
	app.listen(app.get('port'), function () {
		let url = 'http://localhost:' + app.get('port') + '/'
		console.log('\n' + 'Crude API is now running with these endpoints:' + '\n')

		// Show URL of each list endpoints
		console.log(chalk.blue('\tGET       ') + url + '/')
		for (let key in crude.schema) {
			let path = crude.schema[key].plural
			console.log(chalk.blue('\tGET       ') + url + path)
			console.log(chalk.blue('\tGET       ') + url + path + '/:id')
			console.log(chalk.green('\tPOST      ') + url + path)
			console.log(chalk.green('\tPUT       ') + url + path)
			console.log(chalk.yellow('\tDELETE    ') + url + path)
			console.log()
		}

	})

}
