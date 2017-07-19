const config = require('../config')

const transformersOut = {
	array: require('./transformOutArray'),
	timestamp: require('./transformOutTimestamp')
}

const normalizeType = require('./normalizeType')

// Transform one object for being exposed to the outside world
module.exports = function (dbPath, schema, resourceType, row, nest) {
	return new Promise(function (resolve, reject) {
		let promises = 0

		// NOTE: runtime require is needed here
		const select = require('../db/select')

		for (let fieldName in row) {
			let value = row[fieldName]
			let type = normalizeType(fieldName, resourceType, schema, config)

			// FIRST:
			// Just a regular value: transform if we have a callback function to use
			if (transformersOut[type]) {
				row[fieldName] = transformersOut[type](value)
			}

			// ALSO:
			// Type is defined in schema, meaning it's an ID that refers to another resource
			if (nest) {

				// FIXME: this is probably not the best place to do this
				// FIXME: hardcoded nest to be false
				// NOTE: select will call transformOne as well, so the child object will be transformed correctly

				// Singular: one child object
				if (schema.singulars[type]) {
					promises++

					// Select needs the type in plural
					let pluralType = schema.singulars[type]

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
				} else if (schema.plurals[type]) {
					promises++

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
					).then(function (childRow) {

						// Replace ID with child object
						row[fieldName] = childRow

						// Keep track of promises, resolve if we're done
						promises--
						if (!promises) {
							resolve(row)
						}

					})

				}

			}

		}

		if (!promises) {
			resolve(row)
		}

	})
}
