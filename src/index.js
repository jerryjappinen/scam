const _ = require('lodash')
const bodyParser = require('body-parser')

// Central config
// const config = require('./config')

// CLI
const logger = require('./cli/logger')

// Scripts
const clearDatabase = require('./routines/clearDatabase')
const createDatabase = require('./routines/createDatabase')
const loadData = require('./routines/loadData')

// Route initialisers
const routes = require('./routes')

module.exports = {

	// Components
	logger: logger,

	// Props
	app: null,
	cache: null,
	data: {},
	dbPath: null,
	endpoints: null,
	schema: null,

	// Setters

	setApp: function (app) {
		this.app = app
		return this
	},

	setCache: function (cache) {
		if (cache) {
			cache = parseInt(cache)
			if (_.isNumber(cache) && cache > 0) {
				this.cache = cache
			}
		}
		return this
	},

	setData: function (data) {
		if (data) {
			this.data = data
		}
		return this
	},

	setDataFromPath: function (dataPath) {
		return this.setData(require(dataPath))
	},

	setDatabasePath: function (dbPath) {
		this.dbPath = dbPath
		return this
	},

	setSchema: function (resourceTypes) {

		let schema = {
			plurals: {},
			singulars: {},
			resourceTypes: resourceTypes
		}

		// Generate mappings between singular and plural, since keys are stored only in the latter format
		for (let key in schema.resourceTypes) {
			let resource = schema.resourceTypes[key]
			schema.plurals[key] = resource.singular
			schema.singulars[resource.singular] = key
		}

		this.schema = schema
		return this
	},

	setSchemaFromPath: function (schemaPath) {
		return this.setSchema(require(schemaPath))
	},



	// Setup work

	prepareApp: function () {

		// Set up some Express middleware
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({
			extended: true
		}))

		return this
	},

	initRoutes: function () {
		routes(this)
		return this
	},



	// API

	getEndpoints: function () {

		// Meta info at root
		let endpoints = [
			{
				method: 'get',
				path: '/'
			}
		]

		// Per resource type
		for (let key in this.schema.resourceTypes) {
			let path = this.schema.resourceTypes[key].plural

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

			// POST list
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
				path: '/' + path,
				params: ['id']
			})

		}

		return endpoints
	},

	setEndpoints: function (endpoints) {
		this.endpoints = endpoints
		return this
	},



	// CLI logger API

	log: function (url, mono) {
		this.logger.all(this, url, mono)
		return this
	},



	// Lifecycle handling

	clearDatabase: function () {
		clearDatabase(this.dbPath)
	},

	createDatabase: function () {
		createDatabase(this.dbPath, this.schema)
	},

	loadData: function () {
		loadData(this.dbPath, this.schema, this.data)
	},



	// Setup

	init: function (app, options) {

		// Store reference to app and register some middleware
		this.setApp(app).prepareApp()

		// Set default cache time
		this.setCache(options.cache)

		// Data as object or as a path to require from
		if (_.isPlainObject(options.data)) {
			this.setData(options.data)
		} else if (_.isString(options.data)) {
			this.setDataFromPath(options.data)
		}

		// If database path was provided, use it instead of an in-memory DB
		if (_.isString(options.databasePath)) {
			this.setDatabasePath(options.databasePath)
		}

		// Schema as object or as a path to require from
		if (_.isPlainObject(options.schema)) {
			this.setSchema(options.schema)
		} else if (_.isString(options.schema)) {
			this.setSchemaFromPath(options.schema)
		}

		// Define endpoints based on resource types
		this.setEndpoints(this.getEndpoints())

		// Register routes and route handlers for all resource types
		this.initRoutes()

		return this
	}

}
