const _ = require('lodash')
const bodyParser = require('body-parser')
const chalk = require('chalk')

// Scripts
const clearDatabase = require('./routines/clearDatabase')
const setupDatabase = require('./routines/setupDatabase')
const loadData = require('./routines/loadData')

// Route initialisers
const initDeleteById = require('./routes/deleteById')
const initGetRoot = require('./routes/getRoot')
const initGetById = require('./routes/getById')
const initGetList = require('./routes/getList')
const initPutById = require('./routes/putById')
const initPostToList = require('./routes/postToList')

module.exports = {

	// Props

	app: null,
	cache: null,
	data: {},
	dbPath: null,
	endpoints: null,
	schema: null,

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

	setData: function (dataPath) {
		let data = require(dataPath)
		if (data) {
			this.data = data
		}
		return this
	},

	setDbPath: function (dbPath) {
		this.dbPath = dbPath
		return this
	},

	setSchema: function (schemaPath) {
		let schema = {
			plurals: {},
			singulars: {},
			resourceTypes: require(schemaPath)
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



	// Setup work

	prepareApp: function () {
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({
			extended: true
		}))
		return this
	},

	initRoutes: function () {
		initDeleteById(this)
		initGetRoot(this)
		initGetById(this)
		initGetList(this)
		initPostToList(this)
		initPutById(this)
		return this
	},



	// API

	setEndpoints: function () {

		let endpoints = [
			{
				method: 'get',
				path: '/'
			}
		]

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

		this.endpoints = endpoints

		return this
	},

	logEndpoints: function (url, mono) {
		console.log('A Scam REST API is now running with these endpoints:')

		if (!url) {
			url = ''
		}

		let lastPath

		for (let key in this.endpoints) {
			let endpoint = this.endpoints[key]
			let method = endpoint.method.toUpperCase()
			let path = endpoint.path + (endpoint.params ? '/:' + endpoint.params.join('/:') : '')

			// Line break between resources
			if (lastPath !== endpoint.path) {
				lastPath = endpoint.path
				console.log()
			}

			// Print with colors
			let line = '\t' + method + '\t\t'
			if (!mono) {

				// Set color based on method
				let colors = {
					'GET': '#4FBEE3', // blue
					'POST': '#90E92F', // green
					'PUT': '#F5A623', // orange
					'DELETE': '#F0607F' // red
				}

				// Apply color via Chalk
				line = chalk.hex(colors[method] ? colors[method] : colors['get'])(line)

				// Starting part of the URL can be grey
				line = line + chalk.gray(url) + path

			} else {
				line = line + url + path
			}

			console.log(line + path)

		}

	},


	// Lifecycle handling

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

	init: function (app, options) {
		return this.setAll(
			app,
			options.cache,
			options.dbPath,
			options.schemaPath,
			options.dataPath
		).prepare()
	},

	setAll: function (app, cache, dbPath, schemaPath, dataPath) {
		this.setApp(app)
			.setCache(cache)
			.setData(dataPath)
			.setDbPath(dbPath)
			.setSchema(schemaPath)
			.setEndpoints()
		return this
	},

	prepare: function () {
		return this.prepareApp().initRoutes()
	}

}
