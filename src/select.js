const path = require('path')
const Database = require('better-sqlite3')
const squel = require('squel')

const schema = require('../schema')
const dbFilePath = path.resolve(__dirname, '../db.sql')

module.exports = {

	// Select an item by ID
	one: function (resourceType, id) {
		return this.by(resourceType, {
			'id': id
		})
	},

	// Select item by value of any one field
	by: function (resourceType, keyValuePairs) {
		let resource = schema[resourceType]

		let query = squel.select().from(resource.plural)
		for (let key in keyValuePairs) {
			let value = keyValuePairs[key]
			let field = resource.fields[key]
			query = query.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
		}
		query = query.toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbFilePath, {
					readonly: true
				})

				// Execute query
				let row = db.prepare(query).get()

				// Close local database connection
				db.close()

				// Resolve promise
				resolve(row)

			} catch (error) {
				reject(error)
			}
		})
	},

	all: function (resourceType) {
		let resource = schema[resourceType]

		let query = squel.select()
			.from(resource.plural)
			.toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbFilePath, {
					readonly: true
				})

				// Execute query
				let rows = db.prepare(query).all()

				// Close local database connection
				db.close()

				// Resolve promise
				resolve(rows)

			} catch (error) {
				reject(error)
			}
		})
	}

}
