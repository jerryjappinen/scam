const transformOutOne = require('./transformOutOne')

// Run many objects theough appropriate transformations
module.exports = function (dbPath, schema, resourceType, rows, nest) {
	return new Promise(function (resolve, reject) {
		let promises = []

		for (var i = 0; i < rows.length; i++) {
			promises.push(transformOutOne(dbPath, schema, resourceType, rows[i], nest))
		}

		Promise.all(promises).then(function (results) {
			resolve(results)
		}).catch(function (errors) {
			reject(errors)
		})

	})
}
