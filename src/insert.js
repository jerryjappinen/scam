const _ = require('lodash')
const path = require('path')
const Database = require('better-sqlite3')
const squel = require('squel')

const select = require('./select')
const schema = require('../schema')
const dbFilePath = path.resolve(__dirname, '../db.sql')

module.exports = {

	one: function (resourceType, input) {
		let resource = schema[resourceType];

		// Start with defaults as defined in schema
		let defaults = {};
		for (let schemaKey in resource.fields) {
			if (resource.fields !== undefined) {
				defaults[schemaKey] = resource.fields[schemaKey]
			}
		}

		// Override with user input
		let finalValues = _.merge({}, defaults, input)

		// Prepare query
		let query = squel.insert().into(resource.plural)
		for (let key in finalValues) {
			query = query.set(key, input[key])
		}
		query = query.toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbFilePath, {
					readonly: false
				})

				// Execute query
				let insertedInfo = db.prepare(query).run();

				// Close local database connection
				db.close();

				// Fetch the inserted object
				select.one(resourceType, insertedInfo.lastInsertROWID).then(function (row) {

					// Resolve promise
					resolve(row)
				})

			} catch (error) {
				reject(error)
			}
		})
	}

}
