This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Client Packages and Libraries

* [Apollo GraphQL React Client](https://www.apollographql.com/docs/react/)

## Ejecting Create React App

The [client](./) application was [ejected](https://github.com/facebookincubator/create-react-app#converting-to-a-custom-setup) to
support custom configuration, specifically adding support for [stylus](http://stylus-lang.com/) via
the [stylus-loader](https://github.com/shama/stylus-loader) webpack plugin. Additionally, the
[rupture](https://github.com/jescalan/rupture) stylus plugin was added for succinct media query responsive styling.

### Current Configs and Extended Configs

CRA eject created both the [config](./config) and [scripts](./scripts) folders. The [config](./config) folder
contains webpack env configurations.

The [webpack.config.dev.js](./config/webpack.config.dev.js) file was edited to add an additional loader to the
webpack config, based on the existing css loader so that css generated from stylus follows the existing css pipeline.
This section is clearly marked and can be merged with any config changes due to updating CRA. For now only the development
configuration has been updated. The production and test configurations will be updated once our deployment pipelines
are determined.

CRA eject also updated [package.json](./package.json) by adding its packages to the `dependencies` section. These
packages were moved to the `devDependencies` section to separate build/dev from runtime packages.
These `devDependencies` packages can be updated when updating CRA.

## Global Store using Redux

The Forging client includes two global stores:

1. The Apollo store, which contains and manages the API data
2. The [Redux](https://redux.js.org/) store, which contains and manages non API data, such as auth0 authorisation status.

All [action creators](https://redux.js.org/docs/basics/Actions.html#action-creators) are stored in 
the [actions](./src/actions) folder and all [reducers](https://redux.js.org/docs/basics/Reducers.html) are 
stored in the [reducers](./src/reducers) folder.

In addition, [redux-thunk](https://github.com/gaearon/redux-thunk) is also available to define async action creators.  

### Redux Stores

#### authorisation

The authorisation store holds the state of the current user's auth0 authentication status. The store contains three keys:

1. `isAuthenticated` - is true if the current user is authenticated. This can be used in the UI 
using `mapStateToProps` and [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
2. `loading` - user is authenticating
3. `error` - user authentication has failed