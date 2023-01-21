import { gql } from "../__generated__";

const ADD_ACCOUNT = gql(/* GraphQL */ `
  mutation AddAccount($input: AddAccountInput!) {
    addAccount(input: $input) {
      _id
      active
      name
      currency
      reconciled
      transactions
      type
      balance
    }
  }
`);

export default ADD_ACCOUNT;
