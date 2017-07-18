const _ = require('lodash')
const path = require('path')
const Database = require('better-sqlite3')
const squel = require('squel')

const resources = require('../schema')

const db = new Database(path.resolve(__dirname, '../db.sql'), {
	readonly: true
})

module.exports = {

	select: function (resourceType, id) {
		return this.selectBy(resourceType, 'id', id)
	},

	selectBy: function (resourceType, key, value) {
		let resource = resources[resourceType];
		let field = resource.fields[key];
		let query = squel.select()
			.from(resource.plural)
			.where(key + '=' + (field && field.type) === 'string' ? '"' + value + '"' : value)
			.toString()

		return new Promise(function (resolve, reject) {
			try	{
				let row = db.prepare(query).get();
				resolve(row)
			} catch (error) {
				reject(error)
			}
		})

	},

	selectAll: function (resourceType) {
		let resource = resources[resourceType];
		let query = squel.select()
			.from(resource.plural)
			.toString()

		return new Promise(function (resolve, reject) {
			try	{
				let rows = db.prepare(query).all();
				resolve(rows)
			} catch (error) {
				reject(error)
			}
		})

	}

}
