const count = require('./count')

module.exports = {

	where: function (dbPath, schema, resourceType, where) {
		return new Promise(function (resolve, reject) {
			try	{

				// Couint number of rows
				count.where(
					dbPath,
					schema,
					resourceType,
					where

				// Count complete
				).then(function (count) {
					resolve(count > 0 ? true : false)

				// Something went wrong when executing count
				}).catch(function (error) {
					reject(error)
				})

			} catch (error) {
				reject(error)
			}
		})
	}

}
