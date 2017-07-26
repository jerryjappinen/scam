const config = require('../config')

const transformersIn = {
	array: require('./transformInArray'),
	timestamp: require('./transformInTimestamp')
}

const getRawType = require('../helpers/getRawType')

// Transform one object for inserting into database
module.exports = function (dbPath, schema, resourceType, values) {

	// We transform field by field
	for (let fieldName in values) {
		let type = getRawType(fieldName, resourceType, schema, config)
		let value = values[fieldName]

		// Transformer available
		if (transformersIn[type]) {
			values[fieldName] = transformersIn[type](value)
		}

	}

	return values
}
