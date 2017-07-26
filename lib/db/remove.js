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

			// NOTE: should this fail if user with this ID is missing?
			} catch (error) {
				reject(error)
			}

		})
	},

	many: function (dbPath, schema, resourceType, ids) {
		const remove = this
		let promises = []

		// Each object to update in inputs array
		for (var i = 0; i < ids.length; i++) {
			let id = ids[i]

			// Register promise for each removal operation
			promises.push(new Promise(function (resolve, reject) {

				// `remove.one`
				remove.one(dbPath, schema, resourceType, id).then(function () {
					resolve()
				}).catch(function (error) {
					reject(error)
				})

			}))

		}

		// Resolve or reject `insert.many`
		return new Promise(function (resolve, reject) {
			Promise.all(promises).then(function (ids) {
				resolve(ids)
			}).catch(function (errors) {
				reject(errors)
			})
		})
	}

}
