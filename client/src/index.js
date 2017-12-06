import React from 'react';
import ReactDOM from 'react-dom';
import 'auth0-js/build/auth0.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';

const token = localStorage.getItem('access_token');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
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

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);


// const link = ApolloLink.split(
//   hasSubscriptionOperation,
//   new WebSocketLink({
//     uri:
//       'wss://hostname/__path__',
//     options: { reconnect: true },
//   }),
//   new Link({
//     uri: 'https://hostname/__path__',
//   }),
// )

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);


registerServiceWorker();
