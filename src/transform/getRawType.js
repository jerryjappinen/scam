const normalizeType = require('./normalizeType')

// Normalize type of a field, without returning a resource type
module.exports = function (fieldName, resourceType, schema, config) {

	// If the field is a reference to another resource, we need the field type used when storing it
	// List of references to other resources
	if (schema.plurals[fieldName]) {
		return 'array'

	// One reference to another resource
	} else if (schema.singulars[fieldName]) {
		return 'integer'
	}

	return normalizeType(fieldName, resourceType, schema, config)
}
