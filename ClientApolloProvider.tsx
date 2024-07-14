'use client';

import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

const ClientApolloProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ClientApolloProvider;
