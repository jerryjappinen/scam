const bodyParser = require('body-parser')

// Scripts
const clearDatabase = require('./routines/clearDatabase')
const setupDatabase = require('./routines/setupDatabase')
const loadData = require('./routines/loadData')

// Route initialisers
const initGetRoot = require('./routes/getRoot')
const initGetById = require('./routes/getById')
const initGetList = require('./routes/getList')
const initPostToList = require('./routes/postToList')

// Operations
// const insert = require('./insert')
// const select = require('./select')

module.exports = {

	// Props

	app: null,
	data: null,
	dbPath: null,
	schema: null,

	setApp: function (app) {
		this.app = app
		return this
	},

	setData: function (dataPath) {
		this.data = require(dataPath)
		return this
	},

	setDbPath: function (dbPath) {
		this.dbPath = dbPath
		return this
	},

	setSchema: function (schemaPath) {
		this.schema = require(schemaPath)
		return this
	},



	// Setup work

	prepareApp: function (app) {
		app.use(bodyParser.json())
		app.use(bodyParser.urlencoded({
			extended: true
		}))
		return this
	},

	initRoutes: function (app, dbPath, schema) {
		initGetRoot(app, dbPath, schema)
		initGetById(app, dbPath, schema)
		initGetList(app, dbPath, schema)
		initPostToList(app, dbPath, schema)
		return this
	},



	// API

	endpoints: function () {
		let endpoints = [
			{
				method: 'get',
				path: '/'
			}
		]

		for (let key in this.schema) {
			let path = this.schema[key].plural

			// GET list
			endpoints.push({
				method: 'get',
				path: '/' + path
			})

			// GET list/:id
			endpoints.push({
				method: 'get',
				path: '/' + path,
				params: ['id']
			})

			// POST list/:id
			endpoints.push({
				method: 'post',
				path: '/' + path
			})

			// PUT list/:id
			endpoints.push({
				method: 'put',
				path: '/' + path,
				params: ['id']
			})

			// DELETE list/:id
			endpoints.push({
				method: 'delete',
				path: '/' + path
			})

		}

		return endpoints
	},

	clearDatabase: function () {
		clearDatabase(this.dbPath)
	},

	setupDatabase: function () {
		setupDatabase(this.dbPath, this.schema)
	},

	loadData: function () {
		loadData(this.dbPath, this.schema, this.data)
	},



	// Setup

	init: function (app, dbPath, schemaPath, dataPath) {
		return this.setAll(app, dbPath, schemaPath, dataPath).prepare()
	},

	setAll: function (app, dbPath, schemaPath, dataPath) {
		this.setApp(app)
			.setData(dataPath)
			.setDbPath(dbPath)
			.setSchema(schemaPath)
		return this
	},

	prepare: function () {
		return this.prepareApp(this.app).initRoutes(this.app, this.dbPath, this.schema)
	}

}
