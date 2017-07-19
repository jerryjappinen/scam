const options = require('./scam.json')

// Treat paths
const path = require('path')
const pathOptions = ['dataPath', 'schemaPath', 'dbPath']
for (let i = 0; i < pathOptions.length; i++) {
	let key = pathOptions[i]
	options[key] = path.resolve(__dirname, options[key])
}

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
scam.init(app, options)

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
