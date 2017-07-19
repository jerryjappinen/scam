process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')

// let server = require('../')

let should = chai.should()

chai.use(chaiHttp)

// Our parent block
describe('Root', function () {

	// Before each test we empty the database
	// beforeEach(function (done) {})

	describe('GET /', function () {
		it('should GET return success and schema', function (done) {
			chai.request('http://localhost:3333')
				.get('/')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.an('object')
					res.body.endpoints.should.be.an('object')
					res.body.schema.should.be.an('object')
					done()
				})
		})
	})

})
