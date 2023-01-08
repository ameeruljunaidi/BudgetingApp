import { gql } from "../__generated__";

const GET_TRANSACTIONS_FROM_ACCOUNT = gql(/* GraphQL */ `
    query GetTransactionsFromAccount($accountId: String!) {
        getTransactionsFromAccount(accountId: $accountId) {
            _id
            account
            approved
            currency
            reconciled
            scheduled
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

export default GET_TRANSACTIONS_FROM_ACCOUNT;
