import { gql } from "../__generated__";

const GET_USERS = gql(/* GraphQL */ `
  query getUsers {
    getUsers {
      _id
      name
      email
      role
    }
  }
`);

export default GET_USERS;
