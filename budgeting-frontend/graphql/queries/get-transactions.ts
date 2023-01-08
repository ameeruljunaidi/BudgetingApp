import { gql } from "../__generated__";

const GET_TRANSACTIONS = gql(/* GraphQL */ `
  query GetTransactions($input: QueryTransactionsInput!) {
    getTransactions(input: $input) {
      _id
      date
      account
      approved
      currency
      scheduled
      reconciled
      scheduledDates
      transactionDetails {
        amount
        category
        categoryGroup
        payee
      }
    }
  }
`);
