const config = require('./scam.json')

// Treat paths
const path = require('path')
const dataPath = path.resolve(__dirname, config.data)
const schemaPath = path.resolve(__dirname, config.schema)
const dbPath = path.resolve(__dirname, config.db)

// Deps
const express = require('express')
const scam = require('./src')

// Optional middleware
const cors = require('cors')
const nocache = require('nocache')

// Express app setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())

// Setting up Scam
scam.init(app, dbPath, schemaPath, dataPath)

// Specific command defined (other than start)

// List of supported commands
switch (process.argv[2]) {

case 'clear':
	scam.clearDatabase()
	break

case 'init':
	scam.setupDatabase()
	break

case 'load':
	scam.loadData()
	break

// Start the server
default:

	// Start app with some debug info
	const chalk = require('chalk')
	app.listen(app.get('port'), function () {
		let url = 'http://localhost:' + app.get('port')

		console.log('scam API is now running with these endpoints:')

		let lastPath
		for (let key in scam.endpoints) {
			let endpoint = scam.endpoints[key]
			let method = endpoint.method.toUpperCase()
			let path = url + endpoint.path + (endpoint.params ? '/:' + endpoint.params.join('/:') : '')

			let color = endpoint.method === 'get'
				? 'blue'
				: endpoint.method === 'delete'
					? 'yellow'
					: 'green'

			if (lastPath !== endpoint.path) {
				lastPath = endpoint.path
				console.log()
			}

			console.log(chalk[color]('\t' + method + '\t\t') + path)

		}

	})

	break
}
