process.env.NODE_ENV = 'test'

const tape = require('tape')
const axios = require('axios')
const url = 'http://localhost:3333'

tape('HTTP test', function (assert) {
	// assert.plan(1)

	assert.test('GET /', {}, function (subAssert) {

		axios.get(url).then(function (response) {
			// subAssert.plan(4)

			subAssert.equal(response.status, 200, 'Status should be 200')
			subAssert.equal(typeof response.data, 'object', 'Response should be object')
			subAssert.ok(response.data.body, 'Response should include endpoints')
			subAssert.ok(response.data.body.endpoints, 'Response should include endpoints')
			subAssert.ok(response.data.body.resources, 'Response should include schema')

			assert.pass()

		}).catch(function (error) {
			assert.fail(error)
		})

	})

})
