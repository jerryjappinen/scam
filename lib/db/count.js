const Database = require('better-sqlite3')
const squel = require('squel')

module.exports = {

	where: function (dbPath, schema, resourceType, where) {
		let resource = schema.resourceTypes[resourceType]

		// Prepare query
		let countFunction = 'COUNT(*) as count'
		let query = squel.select().function(countFunction).from(resource.plural)

		if (where) {

			// Chain where statements
			// FIXME: turn this into a helper, it's used in many places
			for (let key in where) {
				let value = where[key]
				let field = resource.fields[key]
				query = query.where(key + '=' + ((field && field.type) === 'string' ? '"' + value + '"' : value))
			}

		}

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: true
				})

				// HACK: squel doesn't quite get us the query we want
				let badString = countFunction + ' *'
				query = query.toString().replace(badString, countFunction)

				// Execute query
				let result = db.prepare(query.toString()).get()

				// Close local database connection
				db.close()

				resolve(result.count)

			} catch (error) {
				reject(error)
			}
		})
	}

}
