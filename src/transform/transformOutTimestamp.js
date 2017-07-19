// in: 2017-07-18 20:30:18
// out: 2017-07-18T20:30:18.000Z
module.exports = function (timestamp) {
	return new Date(Date.parse(timestamp))
}
