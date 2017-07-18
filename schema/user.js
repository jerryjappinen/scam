module.exports = {
	singular: 'user',
	plural: 'users',

	fields: {

		email: {
			type: 'string',
			required: true
		},

		accessLevel: {
			type: 'number',
			required: true,
			default: 0
		},

		name: {
			type: 'string',
			required: true
		},

		phone: {
			type: 'string',
			required: false
		}

	}

}
