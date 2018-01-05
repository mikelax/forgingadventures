import React from 'react';
import ReactDOM from 'react-dom';

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
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';


// apollo client setup
const token = localStorage.getItem('access_token');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  };
});

const httpLink = new HttpLink();
const wsLink = new WebSocketLink({
  uri: `ws://localhost:3001/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: token,
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

// redux setup
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
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
