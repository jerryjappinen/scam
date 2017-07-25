module.exports = function (scam, resourceType, request, response, status, body, debug) {

	// Default error status
	// NOTE: Should we read this from error?
	if (!status) {
		status = 400
	}

	// Basic format
	let content = {
		timestamp: new Date()
	}

	content.body = body

	if (scam.debug && debug) {
		content.debug = debug
	}

	// Never cache errors
	response.setHeader('Cache-Control', 'no-cache')

	return response.status(status).json(content)
}
