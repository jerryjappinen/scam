const path = require('path')
const express = require('express')
const scam = require('./src')

// Express app setup
const app = express()
app.set('port', (process.env.PORT || 3333))

// Optional middleware as you wish
// app.use(require('cors'))

try {

	// Set up Scam
	scam.init(app, {

		// Set Scam to debug mode based on CLI params
		debug: process.argv.indexOf('debug') > -1 ? true : false,

		// Other options
		cache: 0,
		data: require('./data'),
		schema: require('./schema'),
		databasePath: path.resolve(__dirname, 'db/db.sql')
	})

	// Deal with the database manually based on CLI arguments
	let arg = process.argv[2]

	// Clear, create and/or load data into database
	if (arg === 'clear') {
		scam.clearDatabase()
	} else if (arg === 'create') {
		scam.createDatabase()
	} else if (arg === 'load') {
		scam.loadData()

	// Start the server and print endpoints
	} else {
		app.listen(app.get('port'), function () {
			scam.log()
		})
	}

} catch (error) {
	console.log()
	console.log(require('util').inspect(error, false, null))
	console.log()
}
