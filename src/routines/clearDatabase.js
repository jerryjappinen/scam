const fs = require('fs')

// Remove DB file
module.exports = function (dbPath) {
	if (fs.existsSync(dbPath)) {
		fs.unlinkSync(dbPath)
	}
}
