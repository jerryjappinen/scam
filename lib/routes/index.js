const deleteById = require('./deleteById')
const getRoot = require('./getRoot')
const getById = require('./getById')
const getList = require('./getList')
const putById = require('./putById')
const postToList = require('./postToList')

module.exports = function (scam) {
	deleteById(scam)
	getRoot(scam)
	getById(scam)
	getList(scam)
	putById(scam)
	postToList(scam)

	return this
}
