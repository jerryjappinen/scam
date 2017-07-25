const _ = require('lodash')

const normalizeRequestParamatersForInput = require('../helpers/normalizeRequestParamatersForInput')

const fail = require('../response/fail')
const success = require('../response/success')

const insert = require('../db/insert')
const select = require('../db/select')

module.exports = function (scam) {

	for (let resourceType in scam.schema.resourceTypes) {
		let resource = scam.schema.resourceTypes[resourceType]

		// Insert response handler
		let handler = function (request, response) {
			const message500one = 'Something went wrong when adding this resource.'
			const message500multiple = 'Something went wrong when adding these resources.'
			let inputParams = request.body

			// Insert many
			if (_.isArray(inputParams)) {
				let valuesToInsert = []

				// Normalize each array item sent
				for (var i = 0; i < inputParams.length; i++) {
					valuesToInsert.push(normalizeRequestParamatersForInput(inputParams[i], resource.fields))
				}

				// Insert new objects
				insert.many(
					scam.dbPath,
					scam.schema,
					resourceType,
					valuesToInsert

				// After insert...
				).then(function (newRowIds) {

					// Fetch the inserted objects
					select.all(
						scam.dbPath,
						scam.schema,
						resourceType,
						{
							id: newRowIds
						},
						false

					// Send success response with the newly created objects
					).then(function (rows) {
						success(
							scam,
							resourceType,
							request,
							response,
							201,
							rows
						)

					// Could not fetch the new objects
					}).catch(function (error) {
						fail(
							scam,
							resourceType,
							request,
							response,
							500,
							message500multiple,
							error
						)
					})

				// Something went wrong when doing the insert
				}).catch(function (error) {
					fail(
						scam,
						resourceType,
						request,
						response,
						500,
						message500multiple,
						error
					)

				})

			// Insert one
			} else if (_.isPlainObject(inputParams)) {

				// Normalize input sent
				let valuesToInsert = normalizeRequestParamatersForInput(request.body, resource.fields)

				// Insert new object
				insert.one(
					scam.dbPath,
					scam.schema,
					resourceType,
					valuesToInsert

				// After insert...
				).then(function (newRowId) {

					// Fetch the inserted object
					select.one(
						scam.dbPath,
						scam.schema,
						resourceType,
						newRowId,
						false

					// Send success response with the newly created object
					).then(function (row) {
						success(
							scam,
							resourceType,
							request,
							response,
							201,
							row
						)

					// Could not fetch the new object
					}).catch(function (error) {
						fail(
							scam,
							resourceType,
							request,
							response,
							500,
							message500one,
							error
						)
					})

				// Something went wrong when doing the insert
				}).catch(function (error) {
					fail(
						scam,
						resourceType,
						request,
						response,
						500,
						message500one,
						error
					)

				})

			// Bad input
			} else {
				fail(
					scam,
					resourceType,
					request,
					response,
					400,
					'Please insert either multiple resources as an array or one resource as an object with key-value pairs.'
				)
			}

		}

		// Register update endpoints
		// NOTE: we do this for convenience, but it's not really correct
		scam.app.patch('/' + resource.plural, handler)
		scam.app.post('/' + resource.plural, handler)

	}

}
