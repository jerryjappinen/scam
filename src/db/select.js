const Database = require('better-sqlite3')
const squel = require('squel')

const transform = require('../transform')

module.exports = {

	// Select an item by ID
	one: function (dbPath, schema, resourceType, id) {
		return this.by(dbPath, schema, resourceType, {
			'id': id
		})
	},

	// Select item by value of any one field
	by: function (dbPath, schema, resourceType, keyValuePairs) {
		let resource = schema[resourceType]

		// Base query
		let query = squel.select().from(resource.plural)

		// Chain where statements
		for (let key in keyValuePairs) {
			let value = keyValuePairs[key]
			let field = resource.fields[key]
			query = query.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
		}
		query = query.toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: true
				})

				// Execute query
				let row = db.prepare(query).get()

				// Close local database connection
				db.close()

				// Resolve promise
				resolve(transform(schema, resourceType, row))

			} catch (error) {
				reject(error)
			}
		})
	},

	all: function (dbPath, schema, resourceType) {
		let resource = schema[resourceType]

		let query = squel.select().from(resource.plural).toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: true
				})

				// Execute query
				let rows = db.prepare(query).all()

				// Close local database connection
				db.close()

				// Resolve promise
				resolve(transform(schema, resourceType, rows))

			} catch (error) {
				reject(error)
			}
		})
	}

}
