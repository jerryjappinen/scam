// Fetch options from a JSON file
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

// Express app setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())

// Setting up Scam
scam.init(app, options)



// List of supported commands
switch (process.argv[2]) {

case 'clear':
	scam.clearDatabase()
	break

case 'create':
	scam.createDatabase()
	break

case 'load':
	scam.loadData()
	break

// Start the server
default:

	// Start app with some debug info
	app.listen(app.get('port'), function () {
		scam.log('http://localhost:' + app.get('port'))
	})

	break
}
