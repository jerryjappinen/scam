// Normalize type of a field
// Returns internal type (not SQL)
module.exports = function (fieldName, resourceType, schema, config) {
	let fields = schema.resourceTypes[resourceType].fields
	let type

	// Field is a native field
	if (config.nativeFields[fieldName]) {
		type = config.nativeFields[fieldName].type

	// Type defined in schema
	} else if (fields[fieldName] && fields[fieldName].type) {
		type = fields[fieldName].type

	// Default to integer
	} else {
		type = config.defaultType
	}

	return type
}
