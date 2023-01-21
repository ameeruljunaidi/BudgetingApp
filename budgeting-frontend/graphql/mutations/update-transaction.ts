import { gql } from "../__generated__";

const UPDATE_TRANSACTION = gql(/* GraphQL */ `
  mutation updateTransaction($transaction: UpdateTransactionInput!) {
    updateTransaction(transaction: $transaction) {
      _id
      account
      approved
      cleared
      currency
      date
      reconciled
      scheduled
      scheduledDates
      transactionDetails {
        amount
        category
        payee
      }
    }
  }
`);

export default UPDATE_TRANSACTION;
