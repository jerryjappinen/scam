const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const config = require('../config')
const normalizeWhereArray = require('../helpers/normalizeWhereArray')
const normalizeWhereValue = require('../helpers/normalizeWhereValue')
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

	all: function (dbPath, schema, resourceType, where, nest, sort) {

		let resource = schema.resourceTypes[resourceType]

		let query = squel.select().from(resource.plural)

		// Chain where statements
		for (let fieldName in where) {
			let value = normalizeWhereArray(fieldName, resourceType, schema, where[fieldName])
			let field = resource.fields[fieldName]

			// Many possible values provided, using OR to select all matches
			if (value instanceof Array) {

				// Normalize each value item
				let values = _.map(value, function (singleValue) {
					if (field) {
						return normalizeWhereValue(fieldName, resourceType, schema, singleValue)
					}
					return singleValue
				})

				// Compose OR query
				query = query.where(fieldName + ' IN (' + values.join(', ') + ')')

			// Just one
			} else {
				query = query.where(fieldName + ' = ' + normalizeWhereValue(fieldName, resourceType, schema, value))
			}

		}

		// Combine sorting rules
		if (sort && (_.isString(sort) || _.isArray(sort)) && sort.length) {

			// Normalize sort so we always deal with an array of sort values
			if (!(sort instanceof Array)) {
				sort = [sort]
			}

			// Always include with default sort order, unless ID is in sort already
			let defaultSort = config.defaultSort
			let defaultSortReverse = defaultSort.substr(0, 1) === '-' ? defaultSort.substr(1) : '-' + defaultSort

			// Add default sort to the sorting rules if it's not there yet
			if (
				!_.includes(sort, defaultSort) &&
				!_.includes(sort, defaultSortReverse)
			) {
				sort = [].concat(sort, [defaultSort])
			}

		} else {
			sort = [config.defaultSort]
		}

		// Apply sorting with "id, -name" syntax support
		for (let i = 0; i < sort.length; i++) {
			let column = sort[i]

			// Desc
			if (column.substr(0, 1) === '-') {
				column = column.substr(1)
				query.order(column, false)

			// ASC
			} else {
				query.order(column)
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
