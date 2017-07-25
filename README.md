
# Scam

Simple schema-based CRUD app bootstrapper on node and SQLite.

- Source: https://github.com/Eiskis/scam
- Demo project: https://github.com/Eiskis/scam-demo
- Demo project deployed to Heroku: https://scam-demo.herokuapp.com/

As the name implies, **Scam is not suitable for production use**! Scam is a prototyping tool intended for designing REST APIs and supporting frontend development.

## Usage

### Schema

Define your schema:

```js
{
  posts: {
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
}
```

Optionally, define dummy data:

```js
{
  posts: [
    {
      name: 'Some Name',
      body: 'Body text body text body text',
      user: 1,
      comments: [1, 2, 3]
    },

    ...

  ]
}
```

Init the app:

```js
const path = require('path')
const express = require('express')
const scam = require('scam')
const app = express()
app.set('port', (process.env.PORT || 3333))

scam.init(app, {
  cache: 0,
  data: { ... },
  debug: true,
  schema: { ... },
  databasePath: path.resolve(__dirname, 'db/db.sql')
})

app.listen(app.get('port'), function () {
  scam.log()
})
```

See the [demo project](https://github.com/Eiskis/scam-demo) for more details.

### Options

```js
{
  // Set Scam to debug mode (prints internal error messages on 500)
  debug: debug,

  // Default cache time (can be overwritten per resource in schema)
  cache: 0,

  // Dummy data as an object, or path to `require` it from
  data: require('./data'),

  // API schema as an object, or path to `require` it from
  schema: require('./schema'),

  // Path of the db file to create/remove/update (in-memory DB not yet supported)
  databasePath: path.resolve(__dirname, 'db/db.sql')
}
```

### API

```js
let app = require('express')()
let scam = require('scam')

// Prepare a new Scam instance
scam.init(app, options)

// Delete DB if it exists
scam.clearDatabase()

// Init new DB based on schema
scam.setupDatabase()

// Load dummy data
scam.loadData()

// Print instructions and endpoints
scam.log()

// Access props
scam.data
scam.dbPath
scam.endpoints
scam.schema
```

### Deployment

You can deploy a Scam API just like any other express app. A quick way to try it out is to host your repo on GitHub and connect it to Heroku.

### Schema: Field types

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

## Contributing

Scam is still early in development, and pretty hacky. See [todo.md](./TODO.md) for the next steps.

Feel free to file issues or PRs though!
