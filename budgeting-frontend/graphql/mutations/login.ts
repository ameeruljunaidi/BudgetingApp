import { gql } from "../__generated__";

const LOGIN = gql(/* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`);

export default LOGIN;
