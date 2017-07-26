// in: 2017-07-18T20:30:18.000Z
// out: 2017-07-18 20:30:18
module.exports = function (timestamp) {
	return new Date(Date.parse(timestamp)).toISOString().slice(0, 19).replace('T', ' ')
}
