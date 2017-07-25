const _ = require('lodash')

module.exports = function (scam, resourceType) {

	// Cache set per type
	if (resourceType) {
		let typeCacheValue = scam.schema.resourceTypes[resourceType].cache
		if (_.isNumber(typeCacheValue)) {
			return Math.min(0, typeCacheValue)
		}
	}

	// Default
	return scam.cache
}
