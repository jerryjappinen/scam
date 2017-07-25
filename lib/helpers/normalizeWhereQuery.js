const _ = require('lodash')

const mathFieldTypes = ['integer', 'float', 'timestamp']
const operators = {
	'!': '!=',
	'<': '<',
	'>': '>'
}

// Set the right operator
// FIXME: needs refactoring, import functionality from select
module.exports = function (rawType, value) {
	let operator = '='

	// Support comparison operators
	if (_.includes(mathFieldTypes, rawType)) {
		if (_.isString(value)) {

			// HACK: can't believe I'm doing this, there must be a library for this
			let potentialOperator = value.substr(0, 1)
			for (var key in operators) {
				if (potentialOperator === key) {
					operator = operators[key]
					value = value.substr(1)
					break
				}
			}

		}
	}

	return operator + ' ' + value
}
