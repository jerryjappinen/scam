// In: [1, 2, 3]
// Out: '[1, 2, 3]'
// NOTE: empty value always stored as empty array
module.exports = function (array) {
	return JSON.stringify(array instanceof Array ? array : [])
}
