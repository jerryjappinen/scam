module.exports = {
	singular: 'post',
	plural: 'posts',
	fields: {

		user: {
			type: 'user',
			required: true
		},

		title: {
			type: 'string',
			required: true
		},

		body: {
			type: 'string',
			required: true
		},

		comments: {
			type: 'comments', // Plural
			required: true
		}

	}
}
