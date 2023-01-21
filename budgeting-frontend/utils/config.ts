export const graphqlUrl = (): string | undefined => {
  switch (process.env.NODE_ENV) {
    case "development":
      return process.env.NEXT_PUBLIC_DEV_GRAPHQL_URL;
    case "test":
      return process.env.NEXT_PUBLIC_TEST_GRAPHQL_URL;
    case "production":
      return process.env.NEXT_PUBLIC_PROD_GRAPHQL_URL;
    default:
      return undefined;
  }
};
