// In: '[1, 2, 3]'
// Out: [1, 2, 3]
// NOTE: empty value always returned as empty array
module.exports = function (arrayAsJsonString) {
	let array = JSON.parse(arrayAsJsonString)
	return array instanceof Array ? array : []
}
