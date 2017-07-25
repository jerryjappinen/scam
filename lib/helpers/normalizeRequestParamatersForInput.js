// Fetch supported values from request body
module.exports = function (inputParams, resourceSchemaFields) {
	let valuesToInsert = {}

	// Only consider keys declared in schema
	for (let fieldName in resourceSchemaFields) {
		if (typeof inputParams[fieldName] !== 'undefined') {
			valuesToInsert[fieldName] = inputParams[fieldName]
		}
	}

	return valuesToInsert
}
