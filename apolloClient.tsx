import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api-cp-dev.intellihire.ai/app-main', // replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
