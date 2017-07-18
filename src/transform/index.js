const _ = require('lodash')

const config = require('../config')

const transformers = {
	timestamp: require('./transformTimestamp')
}



// Transform one object for being exposed to the outside world
const transformOne = function (schema, resourceType, row) {
	let fields = schema[resourceType].fields

	for (let key in row) {
		let value = row[key]
		let type

		// Field is a native field
		if (config.nativeFields[key]) {
			type = config.nativeFields[key].type

		// Type defined in schema
		} else if (fields[key] && fields[key].type) {
			type = fields[key].type

		// Default to integer
		} else {
			type = config.defaultType
		}

		// Type is defined in schema, meaning it's an ID that refers to another resource
		// FIXME
		// - these values are stored as IDs
		// - at this point, `select` should have replaced the ID with the actual object in `row`
		// - but currently this is not implemented, so isPlainObject will never be true
		if (
			_.includes(_.keys(schema), type) &&
			_.isPlainObject(value)
		) {
			row[key] = transformOne(schema, type, value)

		// Just a regular value: transform if we have a callback function to use
		} else if (transformers[type]) {
			row[key] = transformers[type](value)
		}

	}
	return row
}



// Run many objects theough appropriate transformations
const transformMany = function (schema, resourceType, rows) {
	let newRows = []
	for (var i = 0; i < rows.length; i++) {
		newRows.push(transformOne(schema, resourceType, rows[i]))
	}
	return newRows
}

// Transform row(s) for hte outside world
module.exports = function (schema, resourceType, row) {
	if (row instanceof Array) {
		return transformMany(schema, resourceType, row)
	}
	return transformOne(schema, resourceType, row)
}
