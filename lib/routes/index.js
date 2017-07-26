const deleteById = require('./deleteById')
const deleteToList = require('./deleteToList')
const getRoot = require('./getRoot')
const getById = require('./getById')
const getList = require('./getList')
const putById = require('./putById')
const putToList = require('./putToList')
const postToList = require('./postToList')

module.exports = function (scam) {
	deleteById(scam)
	deleteToList(scam)
	getRoot(scam)
	getById(scam)
	getList(scam)
	putById(scam)
	putToList(scam)
	postToList(scam)

	return this
}
