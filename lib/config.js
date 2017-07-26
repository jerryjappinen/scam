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
		},

		updated: {
			type: 'timestamp',
			sqlValue: 'DEFAULT CURRENT_TIMESTAMP'
		}

	},

	// Paramters used in URLs should not be used as field names
	reservedParameterNames: [
		'sort',
		'nest',

		// Not used yet
		'offset',
		'limit'
	],

	// We use these in the query formatter for insert/update
	squelWriteOptions: {

		// Overriding default string formatter because we don't want the placeholders escaped
		stringFormatter: function (string) {
			return string
		}
	},

	consoleLogColors: {
		'get': '#4FBEE3', // blue
		'post': '#90E92F', // green
		'put': '#F5A623', // orange
		'delete': '#F0607F' // red
	},

	errorMessages: {
		options: 'Incorrect options passed to Scam',

		// Option-related error codes
		'options.data.format': 'Data was not passed in the correct format. Pass data as an object, or a string of a path to require data from.',
		'options.schema.format': 'Schema was not passed in the correct format. Pass schema as an object, or a string of a path to require schema from.'

	}

}
