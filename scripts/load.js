const _ = require('lodash')
const path = require('path')
const Database = require('better-sqlite3')

const data = require('../data')
const schema = require('../schema')
const insert = require('../src/insert')

// Init database connection
const db = new Database(path.resolve(__dirname, '../db.sql'), {
	readonly: false
})

// Set up each resource
for (let resourceType in schema) {
	let resource = schema[resourceType]

	// Look initial data from JSON
	if (data[resourceType]) {
		let resourceData = data[resourceType];
		for (var i = 0; i < resourceData.length; i++) {
			insert.one(resourceType, resourceData[i])
		}
	}

}

db.close();
