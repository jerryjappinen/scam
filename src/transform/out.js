const transformOutOne = require('./transformOutOne')
const transformOutMany = require('./transformOutMany')

// Transform row(s) for hte outside world
module.exports = function (dbPath, schema, resourceType, row, nest) {

	if (row instanceof Array) {
		return transformOutMany(dbPath, schema, resourceType, row, nest)
	}

	return transformOutOne(dbPath, schema, resourceType, row, nest)
}
