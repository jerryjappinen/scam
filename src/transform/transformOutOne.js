const config = require('../config')

const transformersOut = {
	array: require('./transformOutArray'),
	timestamp: require('./transformOutTimestamp')
}

const getRawType = require('./getRawType')
const normalizeType = require('./normalizeType')

// Transform one object for being exposed to the outside world
module.exports = function (dbPath, schema, resourceType, row, nest) {
	return new Promise(function (resolve, reject) {
		let promises = 0

		// NOTE: runtime require is needed here
		const select = require('../db/select')

		for (let fieldName in row) {
			let value = row[fieldName]

			// Something like string, array, user or posts
			let type = normalizeType(fieldName, resourceType, schema, config)

			// Something like string or array, never user or posts
			let rawType = getRawType(fieldName, resourceType, schema, config)

			// Type might be defined in schema, meaning it's an ID that refers to another resource
			// Singular: one child object
			console.log('transformOutOne 1', fieldName, nest, type, rawType)

			if (nest && schema.singulars[type]) {
				promises++

				// Select needs the type in plural
				let pluralType = schema.singulars[type]

				console.log('transformOutOne 2', type, pluralType, rawType)

				// Select one object
				select.one(
					dbPath,
					schema,
					pluralType,
					value, // Value is ID
					false // No more nesting beyond this point

				// After select is complete...
				).then(function (childRow) {

					// Replace ID with child object
					row[fieldName] = childRow

					// Keep track of promises, resolve if we're done
					promises--
					if (!promises) {
						resolve(row)
					}

				})

			// Plural: list of child objects
			} else if (nest && schema.plurals[type]) {
				promises++

				console.log('transformOutOne 3', type, rawType)

				// Select one object
				select.all(
					dbPath,
					schema,
					type,
					{
						id: value // Value is array of IDs
					},
					false // No more nesting beyond this point

				// After select is complete...
				).then(function (childRows) {

					// Replace ID with child object
					row[fieldName] = childRows

					// Keep track of promises, resolve if we're done
					promises--
					if (!promises) {
						resolve(row)
					}

				})

			// Just a regular value: transform if we have a callback function to use
			} else {
				if (transformersOut[rawType]) {
					row[fieldName] = transformersOut[rawType](value)
				}
			}

		}

		if (!promises) {
			resolve(row)
		}

	})
}
