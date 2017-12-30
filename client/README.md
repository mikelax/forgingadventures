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


