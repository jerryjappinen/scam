const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const transformOutOne = require('../transform/transformOutOne')
const transformOutMany = require('../transform/transformOutMany')

module.exports = {

	// Select an item by ID
	one: function (dbPath, schema, resourceType, id, nest) {
		return this.by(dbPath, schema, resourceType, {
			'id': id
		}, nest)
	},

	// Select item by value of any one field
	by: function (dbPath, schema, resourceType, where, nest) {
		let resource = schema.resourceTypes[resourceType]

		// Base query
		let query = squel.select().from(resource.plural)

		// Chain where statements
		for (let key in where) {
			let value = where[key]
			let field = resource.fields[key]
			query = query.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
		}

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: true
				})

				// Execute query
				let row = db.prepare(query.toString()).get()

				// Close local database connection
				db.close()

				// Resolve promise
				transformOutOne(dbPath, schema, resourceType, row, nest).then(function (row) {
					resolve(row)
				}).catch(function (error) {
					reject(error)
				})

			} catch (error) {
				reject(error)
			}
		})
	},

	all: function (dbPath, schema, resourceType, where, nest) {
		let resource = schema.resourceTypes[resourceType]

		let query = squel.select().from(resource.plural)

		// Strings need quote treatment
		let normalizeWhereValue = function (field, value) {
			return field && field.type === 'string' ? '"' + value + '"' : value
		}

		// Chain where statements
		for (let key in where) {
			let value = where[key]
			let field = resource.fields[key]

			// Many possible values provided, using OR to select all matches
			if (value instanceof Array) {

				let values = _.map(value, function (singleValue) {
					return normalizeWhereValue(field, singleValue)
				})
				query = query.where(key + ' IN (' + values.join(', ') + ')')

			// Just one
			} else {
				query = query.where(key + ' = ' + normalizeWhereValue(field, value))
			}

		}

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: true
				})

				// Execute query
				let rows = db.prepare(query.toString()).all()

				// Close local database connection
				db.close()

				// Resolve promise
				transformOutMany(dbPath, schema, resourceType, rows, nest).then(function (rows) {
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
