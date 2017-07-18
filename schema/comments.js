module.exports = {
	singular: 'comment',
	plural: 'comments',

	fields: {

		postId: {
			type: 'posts',
			required: true
		},

		userId: {
			type: 'users',
			required: false
		},

		email: {
			type: 'string',
			required: false
		},

		body: {
			type: 'string',
			required: true
		}

	}

}
