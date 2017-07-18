const config = require('../config')

const transformers = {
	timestamp: require('./transformTimestamp')
}

const transformOne = function (resourceTypeSchema, row) {
	for (let key in row) {
		let type

		// Field is a native field
		if (config.nativeFields[key]) {
			type = config.nativeFields[key].type

		// Type defined in schema
		} else if (resourceTypeSchema.fields[key] && resourceTypeSchema.fields[key].type) {
			type = resourceTypeSchema.fields[key].type

		// Default to integer
		} else {
			type = config.defaultType
		}

		// Transform if we have a function
		if (transformers[type]) {
			row[key] = transformers[type](row[key])
		}

	}
	return row
}

const transformMany = function (resourceTypeSchema, rows) {
	let newRows = []
	for (var i = 0; i < rows.length; i++) {
		newRows.push(transformOne(resourceTypeSchema, rows[i]))
	}
	return newRows
}

module.exports = function (resourceTypeSchema, row) {
	if (row instanceof Array) {
		return transformMany(resourceTypeSchema, row)
	}
	return transformOne(resourceTypeSchema, row)
}
