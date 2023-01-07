import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: "http://localhost:8080/graphql",
    documents: ['**/*.ts'],
    generates: {
        './graphql/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;