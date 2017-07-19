const _ = require('lodash')
const Database = require('better-sqlite3')
const config = require('../config')

module.exports = function (dbPath, schema) {

	// Init database connection
	const db = new Database(dbPath, {
		readonly: false
	})

	// Set up each resource
	for (let resourceType in schema.resourceTypes) {
		let resource = schema.resourceTypes[resourceType]
		let columnDefinitions = []

		// Generate columns for SQL
		for (let fieldName in resource.fields) {
			let field = resource.fields[fieldName]

			// Default type
			let sqlType = config.sqlTypes[config.defaultType]

			// Type with an SQL type mapping set in schema
			if (config.sqlTypes[field.type]) {
				sqlType = config.sqlTypes[field.type]

			// Reference to other resource: singular
			} else if (schema.singulars[field.type]) {
				sqlType = config.sqlTypes['integer']

			// Reference to other resource: plural
			} else if (schema.plurals[field.type]) {
				sqlType = config.sqlTypes['array']
			}

			columnDefinitions.push(fieldName + ' ' + sqlType)
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
