const Database = require('better-sqlite3')
const squel = require('squel')

const config = require('../config')
const transformInOne = require('../transform/transformInOne')

module.exports = {

	one: function (dbPath, schema, resourceType, id, input) {
		let resource = schema.resourceTypes[resourceType]

		input.updated = new Date()

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
	},

	many: function (dbPath, schema, resourceType, inputs) {
		const update = this
		let promises = []

		// Each object to update in inputs array
		for (var i = 0; i < inputs.length; i++) {
			let values = inputs[i]

			if (values.id) {
				let id = values.id
				delete values.id

				// Register promise for each update
				promises.push(new Promise(function (resolve, reject) {

					// `update.one`
					update.one(dbPath, schema, resourceType, id, values).then(function (id) {
						resolve(id)
					}).catch(function (error) {
						reject(error)
					})

				}))

			}

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
