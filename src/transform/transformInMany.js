const transformInOne = require('./transformInOne')

// Run many objects theough appropriate transformations
module.exports = function (dbPath, schema, resourceType, rows) {
	return new Promise(function (resolve, reject) {
		let promises = []

		for (var i = 0; i < rows.length; i++) {
			promises.push(transformInOne(dbPath, schema, resourceType, rows[i]))
		}

		Promise.all(promises).then(function (results) {
			resolve(results)
		}).catch(function (errors) {
			reject(errors)
		})

	})
}
