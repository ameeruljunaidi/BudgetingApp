import { gql } from "../__generated__";

const DELETE_ACCOUNT = gql(/* GraphQL */ `
  mutation DeleteAccount($accountId: String!) {
    deleteAccount(accountId: $accountId) {
      _id
      name
    }
  }
`);

export default DELETE_ACCOUNT;
