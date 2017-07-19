const getRawType = require('./getRawType')

// Be accepting when people give out values
module.exports = function (fieldName, resourceType, schema, value) {
	let rawType = getRawType(fieldName, resourceType, schema)

	// Strings need quote treatment
	if (rawType === 'string') {
		return '"' + value + '"'

	// Integers, oh integers
	} else if (rawType === 'integer') {
		return parseInt(value)
	}

	return value
}
