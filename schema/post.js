module.exports = {
	singular: 'post',
	plural: 'posts',

	fields: {

		userId: {
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
		}

	}

}
