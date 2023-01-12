import { gql } from "../__generated__";

const GET_ME = gql(/* GraphQL */ `
  query Me {
    me {
      _id
      email
      name
      role
      accounts {
        _id
        active
        currency
        reconciled
        name
        transactions
        balance
        lastReconciled
        reconciledBalance
        type
      }
      categoryGroups {
        categoryGroup
        categories
      }
      payees
    }
  }
`);

export default GET_ME;
