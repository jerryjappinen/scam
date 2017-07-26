const deleteById = require('./deleteById')
const getRoot = require('./getRoot')
const getById = require('./getById')
const getList = require('./getList')
const putById = require('./putById')
const putToList = require('./putToList')
const postToList = require('./postToList')

module.exports = function (scam) {
	deleteById(scam)
	getRoot(scam)
	getById(scam)
	getList(scam)
	putById(scam)
	putToList(scam)
	postToList(scam)

	return this
}
