module.exports = {
	singular: 'post',
	plural: 'posts',

	fields: {

		user: {
			type: 'users',
			required: true
		},

		title: {
			type: 'string',
			required: true
		},

		body: {
			type: 'string',
			required: true
		}

	}

}
