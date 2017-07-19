const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const config = require('../config')
const transformInOne = require('../transform/transformInOne')

module.exports = {

	one: function (dbPath, schema, resourceType, input) {
		let resource = schema.resourceTypes[resourceType]

		// Start with defaults as defined in schema
		let defaults = {}
		for (let schemaKey in resource.fields) {

			// Default provided
			if (resource.fields.default !== undefined) {
				defaults[schemaKey] = resource.fields[schemaKey].default

			// NULL value
			} else {
				defaults[schemaKey] = null
			}
		}

		// Override with user input, and prepare for SQL
		let finalValues = transformInOne(
			dbPath,
			schema,
			resourceType,
			_.merge(
				{},
				defaults,
				input
			)
		)

		// Prepare query with placeholders (values are entered in run() below)
		let query = squel.insert(config.squelWriteOptions).into(resource.plural)

		for (let key in finalValues) {
			query = query.set(key, '@' + key)
		}

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: false
				})

				// Execute query
				let insertedInfo = db.prepare(query.toString()).run(finalValues)

				// Close local database connection
				db.close()

				// Resolve original promise
				resolve(insertedInfo.lastInsertROWID)

			} catch (error) {
				reject(error)
			}
		})
	}

}
