module.exports = {

	// Mapping of internally used types to something that SQLite understands
	sqlTypes: {
		integer: 'INTEGER',
		string: 'TEXT',
		float: 'FLOAT',
		boolean: 'BOOLEAN',
		array: 'VARCHAR', // array is stored as a string, transformers will handle this
		date: 'TIME',
		time: 'DATE',
		timestamp: 'TIMESTAMP'
	},

	// When field type is not explicitly defined in schema, we default to this
	defaultType: 'integer',
	defaultSort: 'id',
	reservedParameterNames: [
		'sort',
		'nest',

		// Not used yet
		'offset',
		'limit'
	],

	// Some fields are automatically added to the tables, and do not have to be defined in schema
	// FIXME: if they are, we have a problem
	nativeFields: {

		id: {
			type: 'integer',
			sqlValue: 'primary key'
		},

		created: {
			type: 'timestamp',
			sqlValue: 'DEFAULT CURRENT_TIMESTAMP'
		}

	},

	// We use these in the query formatter for insert/update
	squelWriteOptions: {

		// Overriding default string formatter because we don't want the placeholders escaped
		stringFormatter: function (string) {
			return string
		}
	}

}
