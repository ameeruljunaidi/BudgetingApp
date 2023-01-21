import { gql } from "../__generated__";

const ADD_CATEGORY = gql(/* GraphQL */ `
  mutation AddCategory($category: String!, $categoryGroup: String!) {
    addCategory(category: $category, categoryGroup: $categoryGroup) {
      categories
      categoryGroup
    }
  }
`);

export default ADD_CATEGORY;
