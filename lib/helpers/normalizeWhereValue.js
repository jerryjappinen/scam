const _ = require('lodash')

// Be accepting when people give out values
module.exports = function (rawType, value) {

	// Strings need quote treatment
	if (rawType === 'string') {
		return '"' + value + '"'

	// Integers, oh integers
	} else if (rawType === 'integer') {
		let int = parseInt(value)
		if (_.isNumber(int) && !_.isNaN(int)) {
			return int
		}
	}

	return value
}
