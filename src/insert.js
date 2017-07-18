const _ = require('lodash')
const path = require('path')
const Database = require('better-sqlite3')
const squel = require('squel')

const resources = require('../schema')

const db = new Database(path.resolve(__dirname, '../db.sql'), {
	readonly: true
})

module.exports = {

	insertOne: function (resourceType, values) {
		let resource = resources[resourceType];
		let field = resource.fields[key];

		let query = squel.insert().into(resource.plural)

		for (let key in values) {
			query = query.set(key, values[key])
		}

		query = query.toString()

		return new Promise(function (resolve, reject) {
			try	{
				let info = db.prepare(query).run();
				resolve(info.lastInsertROWID)
			} catch (error) {
				reject(error)
			}
		})
	}

}
