import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebase';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const user = auth.currentUser;
  let token = '';

  if (user) {
    try {
      token = await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
