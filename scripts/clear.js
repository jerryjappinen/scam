const fs = require('fs')
const path = require('path')

const dbFilePath = path.resolve(__dirname, '../db.sql')

// Remove DB file
if (fs.existsSync(dbFilePath)) {
	fs.unlinkSync(dbFilePath)
}
