const Database = require('better-sqlite3')
const squel = require('squel')

const config = require('../config')
const transformInOne = require('../transform/transformInOne')

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
		let query = squel.update(config.squelWriteOptions).table(resource.plural).where('id = ' + id)

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

				resolve(id)

			} catch (error) {
				reject(error)
			}
		})
	}

}
