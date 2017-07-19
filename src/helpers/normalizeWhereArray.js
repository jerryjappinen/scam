const getRawType = require('./getRawType')

// Be accepting when people give out values
module.exports = function (fieldName, resourceType, schema, value) {
	let rawType = getRawType(fieldName, resourceType, schema)

	// Integers user might want to check for multiple integer matches
	if (rawType === 'integer' && typeof value === 'string') {
		try {
			let val = JSON.parse(value)
			return val

		// We did our best
		} catch (error) {
			return parseInt(value)
		}

	}

	return value
}
