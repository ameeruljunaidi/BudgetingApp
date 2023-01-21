import { gql } from "../__generated__";

const GET_TRANSACTIONS_PAGINATED = gql(/* GraphQL */ `
  query GetTransactionsFromAccountPaginated($accountId: String!, $take: Float!, $skip: Float!) {
    getTransactionsFromAccountPaginated(accountId: $accountId, take: $take, skip: $skip) {
      hasMore
      items {
        _id
        date
        transactionDetails {
          amount
          category
          payee
        }
        account
        approved
        currency
        cleared
        reconciled
        scheduled
        scheduledDates
      }
    }
  }
`);

export default GET_TRANSACTIONS_PAGINATED;
