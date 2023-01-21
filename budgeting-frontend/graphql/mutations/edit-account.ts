import { gql } from "../__generated__";

const EDIT_ACCOUNT = gql(/* GraphQL */ `
  mutation EditAccount($input: EditAccountInput!) {
    editAccount(input: $input) {
      _id
      name
    }
  }
`);

export default EDIT_ACCOUNT;
