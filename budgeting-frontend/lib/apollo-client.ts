import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import fetch from "cross-fetch";

// const authLink = setContext((_, { headers }) => {
//   const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
//   // const token = "";
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `bearer ${token}` : null,
//     },
//   };
// });

const httpLink = new HttpLink({ uri: "http://localhost:8080/graphql", credentials: "include", fetch: fetch });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
