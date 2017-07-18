# Crude

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

- `string`

You can also use the key of another resource type as the `type`. In this case the values are integers and are treated as IDs pointing to resources of the given type.

## Todo

- [x] Dummy data
- [ ] Make required work (return errors from POST)
- [ ] PUT/UPDATE
- [ ] DELETE
- [ ] Error format
- [ ] Appropriate error codes (not 500 all the time)
- [ ] Relations via type
- [ ] Nesting via $depth
- [ ] Sorting in lists via $sort
- [ ] Filtering in lists via params
- [ ] Document reserved words (query parameters conflicting with prop names, types conflicting with resource types)
