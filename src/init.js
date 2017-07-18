const _ = require('lodash')
const path = require('path')
const Database = require('better-sqlite3')

const resources = require('../schema')

const db = new Database(path.resolve(__dirname, '../db.sql'), {
	readonly: false
})

// Map types used in schema to SQL (defaults to int)
const sqlTypes = {
	string: 'TEXT'
}

// Set up each resource
for (let key in resources) {
	let resource = resources[key]
	let columnDefinitions = ['id INT']
	let columnDummyValues = ['1']

	// Generate columns for SQL
	for (let fieldName in resource.fields) {
		let field = resource.fields[fieldName]
		let type = 'INT'

		if (sqlTypes[field.type]) {
			type = sqlTypes[field.type];
		}

		columnDefinitions.push(fieldName + ' ' + type)
		columnDummyValues.push(type === 'TEXT' ? '"Lorem ipsum"' : 1)
	}

	// Create the tables
	db.prepare('CREATE TABLE ' + resource.plural + ' (' + columnDefinitions.join(', ') + ')').run()

	// Insert dummy data
	db.prepare('INSERT INTO ' + resource.plural + ' VALUES (' + columnDummyValues.join(', ') + ')').run()

}

db.close();
