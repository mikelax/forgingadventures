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

## Application Library Notes

### Helmet

This app uses [react-helmet](https://github.com/nfl/react-helmet) to handle managing page metadata such as title, meta, etc. The main `Helmet` element can be added to any component. Currently it is mainly used for "Page Level" components, but can be used for specific detail pages such as "Viewing a Game". 

When SSR is introduced there are [special hooks](https://github.com/nfl/react-helmet#server-usage) that can be called for helmet to work in that use case. 

## Introducing Redux

A good introduction to Redux in React: https://css-tricks.com/learning-react-redux/

Forging utilises [Redux](https://redux.js.org/) in order to manage a global store to store UI view layer states starting with the
`authorisation` state.

Redux utilises [actions](https://redux.js.org/docs/basics/Actions.html) and [reducers](https://redux.js.org/docs/basics/Reducers.html)
to update state in a [unidirectional](https://redux.js.org/docs/basics/DataFlow.html) manner.

[react-redux](https://github.com/reactjs/react-redux) is used to hook up Redux with React by providing the
[connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
HOC function. 

`connect` is used to "inject" state into props into any component no matter where the component is in the DOM tree - i.e. it negates the
need to pass props down DOM children. In it's most basic form, `connect` requires a `mapStateToProps` function which
maps a Redux store to props:

```
const mapStateToProps = state => ({
  authorisation: state.authorisation,
});

export default connect(
  mapStateToProps
)(Login);
```

In the above `authorisation: state.authorisation` example, the `mapStateToProps` provides the state, from where
we can pick which object to pick from the Redux store - in this instance, the `authorisation` object. This then
becomes available in the wrapped component `Login` as `props.authorisation`.

Additionaly, `connect` takes a second `mapDispatchToProps` function which is used to inject the redux `dispatch` into
components:

```
const mapDispatchToProps = dispatch => ({
  authSuccess: (token) => dispatch(authSuccess(token)),
  authFailure: (e) => dispatch(authFailure(e))
});

export default connect(
  null, //no mapStateToProps
  mapDispatchToProps,
)(App);
```

In the above example, `mapDispatchToProps` is used to define two functions `authSuccess` and `authFailure`, both
used to dispatch actions. `authSuccess` and `authFailure` then becomes available in the wrapped `App` component
as `props.authSuccess()` and `props.authFailure()`.


### Global Store using Redux

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
