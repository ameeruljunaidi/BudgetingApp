/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n    mutation AddAccount($input: AddAccountInput!) {\n        addAccount(input: $input) {\n            _id\n            active\n            name\n            currency\n            reconciled\n            transactions\n            type\n            balance\n        }\n    }\n": types.AddAccountDocument,
    "\n    query Me {\n        me {\n            _id\n            email\n            name\n            role\n            accounts {\n                _id\n                active\n                currency\n                reconciled\n                name\n                transactions\n                type\n                balance\n            }\n            categories\n            categoryGroups\n            payees\n        }\n    }\n": types.MeDocument,
    "\n    query GetTransactionsFromAccount($accountId: String!) {\n        getTransactionsFromAccount(accountId: $accountId) {\n            _id\n            account\n            approved\n            currency\n            reconciled\n            scheduled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n": types.GetTransactionsFromAccountDocument,
    "\n    query GetTransactions($input: QueryTransactionsInput!) {\n        getTransactions(input: $input) {\n            _id\n            account\n            approved\n            currency\n            scheduled\n            reconciled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n": types.GetTransactionsDocument,
    "\n    query getUsers {\n        getUsers {\n            _id\n            name\n            email\n            role\n        }\n    }\n": types.GetUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation AddAccount($input: AddAccountInput!) {\n        addAccount(input: $input) {\n            _id\n            active\n            name\n            currency\n            reconciled\n            transactions\n            type\n            balance\n        }\n    }\n"): (typeof documents)["\n    mutation AddAccount($input: AddAccountInput!) {\n        addAccount(input: $input) {\n            _id\n            active\n            name\n            currency\n            reconciled\n            transactions\n            type\n            balance\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Me {\n        me {\n            _id\n            email\n            name\n            role\n            accounts {\n                _id\n                active\n                currency\n                reconciled\n                name\n                transactions\n                type\n                balance\n            }\n            categories\n            categoryGroups\n            payees\n        }\n    }\n"): (typeof documents)["\n    query Me {\n        me {\n            _id\n            email\n            name\n            role\n            accounts {\n                _id\n                active\n                currency\n                reconciled\n                name\n                transactions\n                type\n                balance\n            }\n            categories\n            categoryGroups\n            payees\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetTransactionsFromAccount($accountId: String!) {\n        getTransactionsFromAccount(accountId: $accountId) {\n            _id\n            account\n            approved\n            currency\n            reconciled\n            scheduled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetTransactionsFromAccount($accountId: String!) {\n        getTransactionsFromAccount(accountId: $accountId) {\n            _id\n            account\n            approved\n            currency\n            reconciled\n            scheduled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetTransactions($input: QueryTransactionsInput!) {\n        getTransactions(input: $input) {\n            _id\n            account\n            approved\n            currency\n            scheduled\n            reconciled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetTransactions($input: QueryTransactionsInput!) {\n        getTransactions(input: $input) {\n            _id\n            account\n            approved\n            currency\n            scheduled\n            reconciled\n            scheduledDates\n            transactionDetails {\n                amount\n                category\n                categoryGroup\n                payee\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getUsers {\n        getUsers {\n            _id\n            name\n            email\n            role\n        }\n    }\n"): (typeof documents)["\n    query getUsers {\n        getUsers {\n            _id\n            name\n            email\n            role\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;