import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import 'auth0-js/build/auth0.js';

import thunkMiddleware from 'redux-thunk';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createStore, applyMiddleware } from 'redux';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';

import App from './components/App/App';
import reducers from './reducers';
import {getAuthorizationHeader, getAccessToken} from './services/login';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';


// apollo client setup

const authLink = setContext((__, { headers }) => {
  return {
    headers: _.merge({}, headers, getAuthorizationHeader())
  };
});

const httpLink = new HttpLink();
const wsLink = new WebSocketLink({
  uri: `ws://localhost:3001/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getAccessToken(),
    }
  }
});

// apollo subscriptions

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// redux setup - make ApolloClient available to action creators to call graphQL queries
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware.withExtraArgument(client))(createStore);
const store = createStoreWithMiddleware(reducers);


ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);


registerServiceWorker();
