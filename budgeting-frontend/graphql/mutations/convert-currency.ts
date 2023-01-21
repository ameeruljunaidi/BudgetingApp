import { gql } from "../__generated__";

const CONVERT_CURRENCY = gql(/* GraphQL */ `
  query convertCurrency($input: ConvertCurrencyInput!) {
    convertCurrency(input: $input) {
      amount
      date
      from
      to
      result
    }
  }
`);

export default CONVERT_CURRENCY;
