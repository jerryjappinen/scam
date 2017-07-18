const path = require('path')
const Database = require('better-sqlite3')

const schema = require('../schema')

// Init database connection
const dbFilePath = path.resolve(__dirname, '../db.sql')
const db = new Database(dbFilePath, {
	readonly: false
})

// Map types used in schema to SQL (defaults to int)
const sqlTypes = {
	string: 'TEXT',
	float: 'FLOAT',
	boolean: 'BOOL'
}

// Set up each resource
for (let resourceType in schema) {
	let resource = schema[resourceType]
	let columnDefinitions = []

	// Generate columns for SQL
	for (let fieldName in resource.fields) {
		let field = resource.fields[fieldName]
		let type = 'INT'

		if (sqlTypes[field.type]) {
			type = sqlTypes[field.type]
		}

		columnDefinitions.push(fieldName + ' ' + type)
	}

	// Create the tables
	db.prepare('CREATE TABLE ' + resource.plural + ' (id integer primary key, ' + columnDefinitions.join(', ') + ')').run()

}

db.close()
