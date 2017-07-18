module.exports = {
	singular: 'comment',
	plural: 'comments',

	fields: {

		postId: {
			type: 'post',
			required: true
		},

		userId: {
			type: 'user',
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
