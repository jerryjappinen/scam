const path = require('path')

const options = {
	cache: 0,
	data: path.resolve(__dirname, 'data/'),
	schema: path.resolve(__dirname, 'schema/'),
	databasePath: path.resolve(__dirname, 'db/db.sql')
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
