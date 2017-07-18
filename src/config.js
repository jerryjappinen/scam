module.exports = {

	// Mapping of internally used types to something that SQLite understands
	sqlTypes: {
		integer: 'INTEGER',
		string: 'TEXT',
		float: 'FLOAT',
		boolean: 'BOOL',
		timestamp: 'TIMESTAMP'
	},

	// When field type is not explicitly defined in schema, we default to this
	defaultType: 'integer',

	// Some fields are automatically added to the tables, and do not have to be defined in schema
	// FIXME: if they are, we have a problem
	nativeFields: {

		id: {
			type: 'integer',
			sqlValue: 'primary key'
		},

		createdAt: {
			type: 'timestamp',
			sqlValue: 'DEFAULT CURRENT_TIMESTAMP'
		}

	}

}
