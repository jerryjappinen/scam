
# Scam

Simple schema-based CRUD app bootstrapper on node and SQLite.

- Source: https://github.com/Eiskis/scam
- Demo: https://scam-demo.herokuapp.com/
- Demo source: https://github.com/Eiskis/scam

As the name implies, **Scam is not suitable for production use**! Scam is a prototyping tool intended for designing REST APIs and supporting frontend development.

**Also, do not use Scam yet!** It's not ready for prime time and will see a healthy number of breaking changes very soon.

## Usage

### Schema

Define your schema under `schema/`.

```js
{
	singular: 'post',
	plural: 'posts',
	fields: [
		name: {
			type: 'string'
		},
		body: {
			type: 'string'
		},
		user: {
			type: 'user' // Note singular
		},
		comments: {
			type: 'comments' // Note plural
		}
	]
}
```

Remember to export each dummy data file in `index.js`.

### Data

Define dummy data under `data/` as `.json` or `.js`:

`data/posts.json`

```json
[
	{
		"name": "Some Name",
		"body": "Body text body text body text",
		"user": 1,
		"comments": [1, 2, 3]
	}
]
```

Remember to export each dummy data file in `index.js`.

### Scripts

```sh
# Delete DB if it exists
npm run clear

# Init new DB based on schema
npm run init

# Load dummy data
npm run load

# All of the above
npm run reload

# Start server
npm run start
```

### Deployment

You can deploy a Scam API just like any other express app. The quickest way is to host your repo on GitHub and connect to Heroku, which will

## Reference

### Field types

The following raw types are supported:

- (`integer`)
- `string`
- `float`
- `boolean`
- `array` (will be stored as string (of JSON) in DB)
- `date`
- `time`
- `timestamp`

Default is `'integer'`, and it doesn't need to be specified.

You can also use the key of another resource type as the `type`. In this case the values are integers and are treated as IDs pointing to resources of the given type.
