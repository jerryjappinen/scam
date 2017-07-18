const _ = require('lodash')

const select = require('./select')
const insert = require('./insert')

module.exports = _.merge(
	{},
	select,
	insert
)
