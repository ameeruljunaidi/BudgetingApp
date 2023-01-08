import { gql } from "../__generated__";

const ADD_TRANSACTION = gql(/* GraphQL */ `
  mutation AddTransaction($input: AddTransactionInput!) {
    addTransaction(input: $input) {
      _id
      date
      account
      approved
      currency
      reconciled
      scheduled
      scheduledDates
      transactionDetails {
        category
        amount
        categoryGroup
        payee
      }
    }
  }
`);

export default ADD_TRANSACTION;
