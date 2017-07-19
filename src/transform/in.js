const transformInOne = require('./transformInOne')
const transformInMany = require('./transformInMany')

// Transform row(s) for hte outside world
module.exports = function (dbPath, schema, resourceType, row, nest) {

	if (row instanceof Array) {
		return transformInMany(dbPath, schema, resourceType, row, nest)
	}

	return transformInOne(dbPath, schema, resourceType, row, nest)
}
