const _ = require('lodash')

const getCacheDuration = require('../helpers/getCacheDuration')

module.exports = function (scam, resourceType, request, response, status, body) {

	// Default status
	if (!status) {
		status = 200
	}

	// Figure out the right cache time
	let cache = 0
	if (request.method.toLowerCase() === 'get' && resourceType) {
		cache = getCacheDuration(scam, resourceType)
	}



	// Response body

	// Basic format
	let content = {
		timestamp: new Date()
	}

	// Never send out undefined
	if (!_.isUndefined(body)) {
		content.body = body
	}

	// Lists get additional meta info
	if (content.body instanceof Array) {

		// Number of items in list vs. available in total
		content.count = content.body.length
		content.totalCount = content.body.length

		// Offset
		content.offset = 0

		// No limit = list not paginated
		content.limit = null
	}

	// Add meta info about resource type
	if (resourceType) {
		content.schema = scam.schema.resourceTypes[resourceType]
	}



	// Headers

	// Set cache headers based on the cache time defined
	if (cache > 0) {
		response.setHeader('Cache-Control', 'public, max-age=' + (cache * 60))
	} else {
		response.setHeader('Cache-Control', 'no-cache')
	}



	// Set and return final response
	return response.status(status).json(content)
}
