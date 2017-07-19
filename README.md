# Scam

Simple schema-based CRUD app bootstrapper on node and SQLite.

## Usage

Define your schema under `schema/`.

```js
{
	singular: 'foo',
	plural: 'foos',
	fields: [
		...
	]
}
```

### Field types

The following raw types are supported:

- (`integer`)
- `string`
- `float`
- `boolean`
- `date`
- `time`
- `timestamp`

Default is `'integer'`, and it doesn't need to be specified.

You can also use the key of another resource type as the `type`. In this case the values are integers and are treated as IDs pointing to resources of the given type.
