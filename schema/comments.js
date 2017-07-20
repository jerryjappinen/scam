module.exports = {
	singular: 'comment',
	plural: 'comments',
	fields: {

		post: {
			type: 'post',
			required: true
		},

		user: {
			type: 'user',
			required: false
		},

		body: {
			type: 'string',
			required: true
		}

	}
}
