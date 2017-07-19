const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const select = require('./select')

const transformIn = require('../transform/in')

module.exports = {

	one: function (dbPath, schema, resourceType, input, nest) {
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
		let finalValues = transformIn(
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
		let query = squel.insert({

			// Overriding default string formatter because we don't want the placeholders escaped
			stringFormatter: function (string) {
				return string
			}

		}).into(resource.plural)
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
				let insertedInfo = db.prepare(query.toString() ).run(finalValues)

				// Close local database connection
				db.close()

				// Fetch the inserted object
				try {
					select.one(dbPath, schema, resourceType, insertedInfo.lastInsertROWID, nest).then(function (row) {

						// Resolve original promise
						resolve(row)

					})

				} catch (error) {
					reject(error)
				}

			} catch (error) {
				reject(error)
			}
		})
	}

}
