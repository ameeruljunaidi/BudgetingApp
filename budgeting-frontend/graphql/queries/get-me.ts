import { gql } from "../__generated__";

const GET_ME = gql(/* GraphQL */ `
  query Me {
    me {
      _id
      name
      email
      role
      accounts {
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
      categoryGroups {
        categoryGroup
        categories
      }
      payees
    }
  }
`);

export default GET_ME;
