const chalk = require('chalk')

// Central config
const config = require('../config')

module.exports = {

	columnWidth: 22,

	color: function (string, key) {
		if (key) {
			key = key.toLowerCase()
			if (config.consoleLogColors[key]) {
				return chalk.hex(config.consoleLogColors[key])(string)
			} else if (chalk[key]) {
				return chalk[key](string)
			}
		}
		return string
	},

	print: function (line, heading) {
		let pad = ' '.repeat(4)

		if (heading) {
			console.log()
		}

		if (line) {
			console.log(pad + (heading ? '' : pad) + line)
		} else {
			console.log()
		}

		if (heading) {
			console.log()
		}

	},

	all: function (endpoints, url, mono) {
		return this
			.endpoints(endpoints, url, mono)
			.sortParams(mono)
			.filterParams(mono)
	},

	endpoints: function (endpoints, url, mono) {

		this.print('A Scam REST API is now running with these endpoints:', true)

		if (!url) {
			url = ''
		}

		let lastPath = endpoints[0].path

		// List each endpoint
		for (let key in endpoints) {
			let endpoint = endpoints[key]

			let method = endpoint.method.toUpperCase()
			let path = endpoint.path + (endpoint.params ? '/:' + endpoint.params.join('/:') : '')
			let pad = this.columnWidth - method.length

			// Line break between resources
			if (lastPath !== endpoint.path) {
				lastPath = endpoint.path
				this.print()
			}

			// Print with colors
			let line = method + (' '.repeat(pad))
			if (!mono) {

				// Apply color
				line = this.color(line, (method ? method : 'get'))

				// Starting part of the URL can be grey
				line = line + this.color(url, 'gray') + path

			// Or without
			} else {
				line = line + url + path
			}

			this.print(line)

		}

		return this
	},

	sortParams: function (mono) {

		let sort = [
			['by ID', '?sort=id'],
			['by ID descending', '?sort=-id'],
			['by any field', '?sort=name'],
			['by multiple fields', '?sort=-created,email']
		]

		// Heading
		this.print('Sort lists:', true)

		// Instructions
		for (var i = 0; i < sort.length; i++) {
			let description = sort[i][0]
			let params = sort[i][1]

			let pad = ' '.repeat(this.columnWidth - description.length)

			if (!mono) {
				params = this.color(params, 'get')
			}

			this.print(description + pad + params)
		}

		return this
	},

	filterParams: function (mono) {

		let filters = [
			['by ID', '?id=4'],
			['with OR', '?id=4,5,6'],
			['by any field', '?email=foo@bar.com'],
			['by multiple fields', '?role=guest&paymentStatus=bad']
		]

		// Heading
		this.print('Filter lists:', true)

		// Instructions

		for (var i = 0; i < filters.length; i++) {
			let description = filters[i][0]
			let params = filters[i][1]

			let pad = ' '.repeat(this.columnWidth - description.length)

			if (!mono) {
				params = this.color(params, 'get')
			}

			this.print(description + pad + params)
		}

	}

}