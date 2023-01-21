import { gql } from "../__generated__";

const DELETE_TRANSACTION = gql(/* GraphQL */ `
  mutation DeleteTransaction($accountId: String!, $transactionId: String!) {
    deleteTransaction(accountId: $accountId, transactionId: $transactionId) {
      _id
      account
      transactionDetails {
        amount
        category
        category
        payee
      }
    }
  }
`);

export default DELETE_TRANSACTION;
