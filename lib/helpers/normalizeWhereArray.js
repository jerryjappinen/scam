const _ = require('lodash')

// Be accepting when people give out values
module.exports = function (rawType, value) {

	// Integers user might want to check for multiple integer matches
	if (rawType === 'integer' && typeof value === 'string') {
		try {
			let val = JSON.parse(value)
			return val

		// We did our best
		} catch (error) {
			let int = parseInt(value)
			if (_.isNumber(int) && !_.isNaN(int)) {
				return int
			}
		}

	}

	return value
}
