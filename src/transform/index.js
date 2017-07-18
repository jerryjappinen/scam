const _ = require('lodash')

const config = require('../config')

const transformers = {
	timestamp: require('./transformTimestamp')
}



// Transform one object for being exposed to the outside world
const transformOne = function (dbPath, schema, resourceType, row, nest) {
	return new Promise(function (resolve, reject) {
		let fields = schema[resourceType].fields
		let promises = 0

		// NOTE: runtime require is needed here
		const select = require('../db/select')

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

			// Just a regular value: transform if we have a callback function to use
			if (transformers[type]) {
				row[key] = transformers[type](value)

			// Type is defined in schema, meaning it's an ID that refers to another resource
			// FIXME
			// - these values are stored as IDs
			// - at this point, `select` should have replaced the ID with the actual object in `row`
			// - but currently this is not implemented, so isPlainObject will never be true
			} else if (_.includes(_.keys(schema), type) && nest) {
				promises++

				// FIXME: this is probably not the best place to do this
				// FIXME: hardcoded nest to be false
				// NOTE: select will call transformOne as well, so the child object will be transformed correctly
				select.one(dbPath, schema, type, value, false).then(function (childRow) {
					row[key] = childRow

					promises--
					if (!promises) {
						resolve(row)
					}

				})

			}

		}

		if (!promises) {
			resolve(row)
		}

	})
}



// Run many objects theough appropriate transformations
const transformMany = function (dbPath, schema, resourceType, rows, nest) {
	return new Promise(function (resolve, reject) {
		let promises = []

		for (var i = 0; i < rows.length; i++) {
			promises.push(transformOne(dbPath, schema, resourceType, rows[i], nest))
		}

		Promise.all(promises).then(function (results) {
			resolve(results)
		}).catch(function (errors) {
			reject(errors)
		})

	})
}

// Transform row(s) for hte outside world
module.exports = function (dbPath, schema, resourceType, row, nest) {

	if (row instanceof Array) {
		return transformMany(dbPath, schema, resourceType, row, nest)
	}

	return transformOne(dbPath, schema, resourceType, row, nest)
}
