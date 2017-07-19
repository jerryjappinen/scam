// Normalize type of a field
// Returns internal type (not SQL)
module.exports = function (fieldName, resourceType, schema, config) {
	let fields = schema.resourceTypes[resourceType].fields
	let type

	// If the field is a reference to another resource, we need the field type used when storing it
	// List of references to other resources
	if (schema.plurals[fieldName]) {
		type = 'array'

	// One reference to another resource
	} else if (schema.plurals[fieldName]) {
		type = 'integer'

	// Field is a native field
	} else if (config.nativeFields[fieldName]) {
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
