// Error to throw when user has passed incorrect options to a new Scam instance
const config = require('../config')

function ScamOptionsError (code) {
	const message = config.errorMessages[code]

	this.name = 'ScamOptionsError'
	this.code = code

	this.message = config.errorMessages['options'] + (message ? ': ' + message : message)

	this.stack = (new Error()).stack
}

ScamOptionsError.prototype = Object.create(Error.prototype)
ScamOptionsError.prototype.constructor = ScamOptionsError

module.exports = ScamOptionsError
