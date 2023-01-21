import { gql } from "../__generated__";

const GET_TRANSACTIONS_FROM_ACCOUNT = gql(/* GraphQL */ `
  query getTransactionsFromAccount($accountId: String!) {
    getTransactionsFromAccount(accountId: $accountId) {
      _id
      account
      approved
      cleared
      date
      currency
      reconciled
      scheduledDates
      scheduled
      transactionDetails {
        amount
        category
        payee
      }
    }
  }
`);

export default GET_TRANSACTIONS_FROM_ACCOUNT;
