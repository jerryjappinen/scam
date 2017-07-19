const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const select = require('./select')

const transformInOne = require('../transform/transformInOne')
// const transformInMany = require('../transform/transformInMany')

module.exports = {

	one: function (dbPath, schema, resourceType, id, input) {
		let resource = schema.resourceTypes[resourceType]

		// Override with user input, and prepare for SQL
		let finalValues = transformInOne(
			dbPath,
			schema,
			resourceType,
			input
		)

		// Prepare query with placeholders (values are entered in run() below)
		let query = squel.update({

			// Overriding default string formatter because we don't want the placeholders escaped
			stringFormatter: function (string) {
				return string
			}

		}).table(resource.plural).where('id = ' + id)

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
				db.prepare(query.toString()).run(finalValues)

				// Close local database connection
				db.close()

				// Fetch the inserted object
				// FIXME: move this to route handler
				try {
					select.one(dbPath, schema, resourceType, id, false).then(function (row) {

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
