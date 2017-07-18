const Database = require('better-sqlite3')
const squel = require('squel')

const transform = require('../transform')

module.exports = {

	// Select an item by ID
	one: function (dbPath, schema, resourceType, id, nest) {
		return this.by(dbPath, schema, resourceType, {
			'id': id
		}, nest)
	},

	// Select item by value of any one field
	by: function (dbPath, schema, resourceType, where, nest) {
		let resource = schema[resourceType]

		// Base query
		let query = squel.select().from(resource.plural)

		// Chain where statements
		for (let key in where) {
			let value = where[key]
			let field = resource.fields[key]
			query = query.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
		}

		// Nesting
		// if (nest) {
		// 	query = query.left_join()
		// }

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
				transform(dbPath, schema, resourceType, row, nest).then(function (row) {
					resolve(row)
				}).catch(function (error) {
					reject(error)
				})

			} catch (error) {
				reject(error)
			}
		})
	},

	all: function (dbPath, schema, resourceType, nest) {
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
				transform(dbPath, schema, resourceType, rows, nest).then(function (rows) {
					resolve(rows)
				}).catch(function (error) {
					reject(error)
				})

			} catch (error) {
				reject(error)
			}
		})
	}

}
