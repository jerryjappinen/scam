const _ = require('lodash')
const Database = require('better-sqlite3')
const config = require('../config')

module.exports = function (dbPath, schema) {

	// Init database connection
	const db = new Database(dbPath, {
		readonly: false
	})

	// Set up each resource
	for (let resourceType in schema) {
		let resource = schema[resourceType]
		let columnDefinitions = []

		// Generate columns for SQL
		for (let fieldName in resource.fields) {
			let field = resource.fields[fieldName]
			let type = config.sqlTypes[config.defaultType]

			if (config.sqlTypes[field.type]) {
				type = config.sqlTypes[field.type]
			}

			columnDefinitions.push(fieldName + ' ' + type)
		}

		// Compose SQL query for each native field
		let nativeFieldSqls = _.map(config.nativeFields, function (field, fieldName) {
			return fieldName + ' ' + config.sqlTypes[field.type] + ' ' + field.sqlValue
		})

		// Create the tables
		db.prepare(
			'CREATE TABLE ' +
			resource.plural +
			' (' +
				[].concat(
					nativeFieldSqls,
					columnDefinitions
				).join(', ') +
			')'
		).run()

	}

	db.close()

}
