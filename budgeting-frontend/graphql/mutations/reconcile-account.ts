import { gql } from "../__generated__";

const RECONCILE_ACCOUNT = gql(/* GraphQL */ `
  mutation ReconcileAccount($newBalance: Float!, $accountId: String!) {
    reconcileAccount(newBalance: $newBalance, accountId: $accountId) {
      _id
      active
      balance
      currency
      lastReconciled
      name
      reconciled
      reconciledBalance
      transactions
      type
    }
  }
`);

export default RECONCILE_ACCOUNT;
