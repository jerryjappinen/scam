# Todo

- Support promises in transformMany

- [x] Dummy data
- [x] Field transformers
- [x] `created` timestamp
- [x] Relations via type
- [x] Make config and module code spearate
- [x] Rename from `scam` to something else
- [x] Publish in NPM
- [x] Sorting in lists via `sort` param
- [x] Filtering in lists via any non-reserved field param in query
- [x] Better `normalizeWhereValue`
- [x] PUT/UPDATE
- [x] DELETE
- [x] Move selection after insert/update to route handlers
- [x] Cache in config and schema
- [x] Allow setting type in singular in schema or use another key for setting reference
- [x] Make some kind of response formatter for success and error responses
- [x] Support nested object lists (IDs and/or expanded, singular vs. plural, using `select.all`)
- [x] ~~Control nesting level via `depth` param (have to control circular references somehow)~~
	- One is enough
- [x] Add `logEndpoints` to module
- [x] Add option for debug mode and print internal error messages as debug field
- [x] Filter integers and timestamps by operator (`<`, `>`, `<=`, `>=`)
- [x] Support POSTing an array of resources (`insert.many`)
- [ ] Support PUTting an array of resources (`update.many`)
- [x] Separate repos for demo and module
- [ ] Appropriate error codes (returns 500 quite often)
- [ ] Define and document error format
- [ ] `updated` timestamp
- [ ] Make `required` work in schema (return errors from POST and UPDATE)
- [ ] Make `default` work in schema
- [ ] Infer type from default if type is omitted in schema
- [ ] Document reserved words (query parameters conflicting with prop names, types conflicting with resource types)
- [ ] Set up test coverage
- [ ] Pagination (limits and offsets)
- [ ] Proper input validation errors
- [ ] Validate schema upon init
- [ ] Validate data upon init (against schema)
- [x] Validate options upon init
- [x] Support schema and schema path as option
- [x] Support data and data path as option
- [ ] Default to in-memory db when databasePath is omitted
- [ ] `.log()` some more information about about data, schema, databasePath and other options
- [ ] Validate all params (sort, nest, filter per field rawType)

## Rewrite

Refactor app to have more structure and less passing the same arguments everywhere.

- `ScamConfig`
- `ScamSchema`
- `ScamResourceType`
- `ScamResourceField`
- `ScamResponseSuccess`
- `ScamResponseFail`
