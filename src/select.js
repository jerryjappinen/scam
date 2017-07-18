const path = require('path')
const Database = require('better-sqlite3')
const squel = require('squel')

const schema = require('../schema')
const dbFilePath = path.resolve(__dirname, '../db.sql')

module.exports = {

	one: function (resourceType, id) {
		return this.by(resourceType, 'id', id)
	},

	by: function (resourceType, key, value) {
		let resource = schema[resourceType]
		let field = resource.fields[key]

		let query = squel.select()
			.from(resource.plural)
			.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
			.toString()

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
