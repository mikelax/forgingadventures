# Details

## Code Linting

This project is set up with [eslint](https://eslint.org/) using the [airbnb style guide](https://www.npmjs.com/package/eslint-config-airbnb).

The airbnb and eslint versions being used include support for most of the webpack and babel features, but [babel-eslint](https://github.com/babel/babel-eslint) was required to get *all* features working, ie. static properties.

To lint this project run the following command:

```bash
yarn lint
```

## Database Migrations

The project uses [knex for database migrations](http://knexjs.org/#Installation-migrations). Here are the basic commands to run:

```bash
# Create a new migration file
yarn migrate:make issuenum_migration_name

# From api container, run migrations
yarn migrate:latest

# From api container, Rollback last set of migrations
yarn migrate:rollback
```

## Configuration Notes

The project uses the [node-config](https://github.com/lorenwest/node-config) package to manage configuration files between environments.

### Auth0

There are two attributes defined under the main `auth0` object within the config json files.

The first attirbute is named `faClient`. This contains properties that are used for security and validation of the main FA Client and API. This contains keys for the Auth0 Client `Forging Adventures` such as the clientId, domain, audience, and redirectUri.

The second attribute is named `managementClient`. This is uses to allow the api project to make API calls to the [Auth0 Management API](https://auth0.com/docs/api/management/v2). *NOTE* this Management API is totally separate from the regular Auth0 Authorization API. Management is used for "admin level" functionality. It uses a [client_credentials token type](https://auth0.com/docs/api/management/v2/tokens#automate-the-process) to allow server-to-server communication.
