module.exports = function (scam, resourceType, response, status, error) {

	// Default error status
	// NOTE: Should we read this from error?
	if (!status) {
		status = 400
	}

	// Basic format
	let content = {
		timestamp: new Date()
	}

	// Never send out undefined
	if (error) {
		content.body = error.message ? error.message : ('' + error)
	}

	// Never cache errors
	response.setHeader('Cache-Control', 'no-cache')

	return response.status(status).json(content)
}
