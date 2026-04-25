import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      pollInterval: 12_000,
    },
  },
})
