const Database = require('better-sqlite3')
const squel = require('squel')

// const config = require('../config')

module.exports = {

	one: function (dbPath, schema, resourceType, id) {
		let resource = schema.resourceTypes[resourceType]

		// Prepare query
		let query = squel.delete({}).from(resource.plural).where('id = ' + id)

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: false
				})

				// Execute query
				db.prepare(query.toString()).run()

				// Close local database connection
				db.close()

				resolve()

			} catch (error) {
				reject(error)
			}
		})
	}

}
