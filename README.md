# Forging Adventures

This repo contains all the projects required to create and run the FA application. The `client` web project is based off the [create-react-app](https://github.com/facebookincubator/create-react-app) starter project. That was used as a base with additional useful libraries and options enabled.

## Details

This repo is organized into three separate projects, one for the React client, one for the backend server API, and one for all the (AWS) Infrastructure to run and deploy everything. This is based off [this article](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) with some slight changes to the folder layout. I didn't want any coupling between the API and client, so they are in totally separate folders to allow zero cross-over. One can be totally replaced without knowledge to the other.

Start scripts/etc are currently not cross-platform compatible. The current setup supports macOS / Linux.

### How to run - on the host

The package.json file in the ROOT folder is present mainly to support npm scripts to run the development environment.

First the dependencies must be installed, run the following install commands:

```shell
yarn install
cd client && yarn install && cd ..
cd api && yarn install && cd ..
```

Edit [package.json](./client/package.json) and set `"proxy": "http://localhost:3001/"`

`yarn start` - This starts both the API server and the react client webpack server. It utilizes [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run both servers in parallel in a single command window.

### How to run - using docker

Install [docker](https://www.docker.com/docker-mac)
NOTE: Config values for some container parameters (ie. db) are set up using [env files](https://docs.docker.com/compose/environment-variables/).

NOTE 2: If you get errors about certain npm libs not building correctly, it could be that the node_modules folder
from the host machine was copied to a docker container. Delete the `node_modules` folder on the host in the api
and client folders and then recreate the containers.

NOTE 3: Note that switching branches on the host is prone to crashing the docker services especially if new
packages have been added to either the `api` or `client` folders. It is advisable to `docker-compose stop && docker-compose up --build`
after switching branches.

From the root folder run:

```bash
# Optionally, pull public postgres docker library
docker pull postgres

# to start both the api and client containers
docker-compose up --build
```

Use the following command to _shell_ into a docker - for example to open a shell in the api container:

```bash
bash -c "clear && docker exec -it reactapipoc_api_1 sh"
```

### GraphQL

The API server presents a [GraphQL](http://graphql.org) endpoint via `/graphql`. The [GraphiQL](https://github.com/graphql/graphiql) browser
is also accessible via [http://localhost:3001/graphiql](http://localhost:3001/graphiql)

An [introduction](http://graphql.org/learn/) to GraphQL language and schema syntax
definitions can be be found [here](http://graphql.org/graphql-js/).

This project uses [Apollo graphql-tools](https://www.apollographql.com/docs/graphql-tools/) to define graphQL
schemas in the [schemas](api/src/schemas) folder.

### Additional Libraries & Integrations

- Server API powered by Express
- [Auth0](https://auth0.com/docs/quickstart/spa/react)
- [React Router](https://reacttraining.com/react-router/web/guides/philosophy) v4
- [React Semantic UI](https://react.semantic-ui.com)
- [Docker](https://www.docker.com/)
- [Postgres 9.6](https://www.postgresql.org/docs/9.6/static/index.html)
- [Webpack3](https://webpack.js.org/) with [babel](https://babeljs.io/) on the API for ES6/ES7 language features
- [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server/) Express integration
- Auth0 automatic token renewal

## TODO

This is a basic TODO list of additional libraries and enhancements I want to add to this POC to get it closer to a true starting point for a new project.

- [X] Integrate express as API server
- [X] Enhance Auth0 integration with [SPA / API guide](https://auth0.com/docs/architecture-scenarios/application/spa-api)
  - perms - [Authorization Extension](https://auth0.com/docs/extensions/authorization-extension/v2). Create perms, assign to roles, then create Rule to enforce scopes requested.
- [X] Automatically Add new User (after Sign Up) to Auth0 Role
- [X] Database migrations framework - knex
- [X] Enhance [automatic token renewal](https://auth0.com/docs/quickstart/spa/react/05-token-renewal) implementation with better silient.html. Inject variables from server. Also currently redirects back to homepage.
- [X] Secure API with [JWT verification](https://auth0.com/docs/jwks)
- [X] Implement login page with [custom Lock](https://auth0.com/docs/libraries/lock/v10) implementation
- [X] CSS (Stylus) preprocessor [integration](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc)
- [ ] flow - [Currently integrated](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-flow) but not fully covered
- [X] Restart express server on code changes. Maybe [nodemon](https://github.com/remy/nodemon)
- [ ] CI/CD Set up
- [ ] Google Tag Manager / Google Analytics - Possible [page tracking option](https://www.pmg.com/blog/tracking-single-page-web-apps-google-tag-manager-analytics/)
- [X] Better Handling of ENV variables for multiple environments

## Further Reading

- [Auth0 SPA Architecture Tutorial](https://auth0.com/docs/architecture-scenarios/application/spa-api)
