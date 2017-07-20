const _ = require('lodash')

const getCacheDuration = require('../helpers/getCacheDuration')

module.exports = function (scam, resourceType, response, status, body) {

	// Default status
	if (!status) {
		status = 200
	}

	// Basic format
	let content = {
		timestamp: new Date()
	}

	// Never send out undefined
	if (!_.isUndefined(body)) {
		content.body = body
	}

	// Lists get additional meta info
	if (body instanceof Array) {

		// Number of items in list vs. available in total
		content.count = body.length
		content.totalCount = body.length

		// Offset
		content.offset = 0

		// No limit = list not paginated
		content.limit = null
	}

	// Set cache headers based on the cache time defined
	let cache = getCacheDuration(scam, resourceType)
	if (cache > 0) {
		response.setHeader('Cache-Control', 'public, max-age=' + (cache * 60))
	} else {
		response.setHeader('Cache-Control', 'no-cache')
	}

	return response.status(status).json(content)
}
