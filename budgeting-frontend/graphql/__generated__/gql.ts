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
    "\n  mutation AddAccount($input: AddAccountInput!) {\n    addAccount(input: $input) {\n      _id\n      active\n      name\n      currency\n      reconciled\n      transactions\n      type\n      balance\n    }\n  }\n": types.AddAccountDocument,
    "\n  mutation AddTransaction($input: AddTransactionInput!) {\n    addTransaction(input: $input) {\n      _id\n      date\n      account\n      approved\n      currency\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        category\n        amount\n        payee\n      }\n    }\n  }\n": types.AddTransactionDocument,
    "\n  query Query($input: ConvertCurrencyInput!) {\n    convertCurrency(input: $input) {\n      amount\n      date\n      from\n      to\n      result\n    }\n  }\n": types.QueryDocument,
    "\n  mutation DeleteTransaction($accountId: String!, $transactionId: String!) {\n    deleteTransaction(accountId: $accountId, transactionId: $transactionId) {\n      _id\n      account\n      transactionDetails {\n        amount\n        category\n        category\n        payee\n      }\n    }\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input)\n  }\n": types.LoginDocument,
    "\n  mutation ReconcileAccount($newBalance: Float!, $accountId: String!) {\n    reconcileAccount(newBalance: $newBalance, accountId: $accountId) {\n      _id\n      active\n      balance\n      currency\n      lastReconciled\n      name\n      reconciled\n      reconciledBalance\n      transactions\n      type\n    }\n  }\n": types.ReconcileAccountDocument,
    "\n  mutation updateTransaction($transaction: UpdateTransactionInput!) {\n    updateTransaction(transaction: $transaction) {\n      _id\n      account\n      approved\n      cleared\n      currency\n      date\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  query Me {\n    me {\n      _id\n      email\n      name\n      role\n      accounts {\n        _id\n        active\n        currency\n        reconciled\n        name\n        transactions\n        balance\n        lastReconciled\n        reconciledBalance\n        type\n      }\n      categoryGroups {\n        categoryGroup\n        categories\n      }\n      payees\n    }\n  }\n": types.MeDocument,
    "\n  query getTransactionsFromAccount($accountId: String!) {\n    getTransactionsFromAccount(accountId: $accountId) {\n      _id\n      account\n      approved\n      cleared\n      date\n      currency\n      reconciled\n      scheduledDates\n      scheduled\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n": types.GetTransactionsFromAccountDocument,
    "\n  query getUsers {\n    getUsers {\n      _id\n      name\n      email\n      role\n    }\n  }\n": types.GetUsersDocument,
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
export function gql(source: "\n  mutation AddAccount($input: AddAccountInput!) {\n    addAccount(input: $input) {\n      _id\n      active\n      name\n      currency\n      reconciled\n      transactions\n      type\n      balance\n    }\n  }\n"): (typeof documents)["\n  mutation AddAccount($input: AddAccountInput!) {\n    addAccount(input: $input) {\n      _id\n      active\n      name\n      currency\n      reconciled\n      transactions\n      type\n      balance\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddTransaction($input: AddTransactionInput!) {\n    addTransaction(input: $input) {\n      _id\n      date\n      account\n      approved\n      currency\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        category\n        amount\n        payee\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddTransaction($input: AddTransactionInput!) {\n    addTransaction(input: $input) {\n      _id\n      date\n      account\n      approved\n      currency\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        category\n        amount\n        payee\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Query($input: ConvertCurrencyInput!) {\n    convertCurrency(input: $input) {\n      amount\n      date\n      from\n      to\n      result\n    }\n  }\n"): (typeof documents)["\n  query Query($input: ConvertCurrencyInput!) {\n    convertCurrency(input: $input) {\n      amount\n      date\n      from\n      to\n      result\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTransaction($accountId: String!, $transactionId: String!) {\n    deleteTransaction(accountId: $accountId, transactionId: $transactionId) {\n      _id\n      account\n      transactionDetails {\n        amount\n        category\n        category\n        payee\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($accountId: String!, $transactionId: String!) {\n    deleteTransaction(accountId: $accountId, transactionId: $transactionId) {\n      _id\n      account\n      transactionDetails {\n        amount\n        category\n        category\n        payee\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input)\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ReconcileAccount($newBalance: Float!, $accountId: String!) {\n    reconcileAccount(newBalance: $newBalance, accountId: $accountId) {\n      _id\n      active\n      balance\n      currency\n      lastReconciled\n      name\n      reconciled\n      reconciledBalance\n      transactions\n      type\n    }\n  }\n"): (typeof documents)["\n  mutation ReconcileAccount($newBalance: Float!, $accountId: String!) {\n    reconcileAccount(newBalance: $newBalance, accountId: $accountId) {\n      _id\n      active\n      balance\n      currency\n      lastReconciled\n      name\n      reconciled\n      reconciledBalance\n      transactions\n      type\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateTransaction($transaction: UpdateTransactionInput!) {\n    updateTransaction(transaction: $transaction) {\n      _id\n      account\n      approved\n      cleared\n      currency\n      date\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateTransaction($transaction: UpdateTransactionInput!) {\n    updateTransaction(transaction: $transaction) {\n      _id\n      account\n      approved\n      cleared\n      currency\n      date\n      reconciled\n      scheduled\n      scheduledDates\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      _id\n      email\n      name\n      role\n      accounts {\n        _id\n        active\n        currency\n        reconciled\n        name\n        transactions\n        balance\n        lastReconciled\n        reconciledBalance\n        type\n      }\n      categoryGroups {\n        categoryGroup\n        categories\n      }\n      payees\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      _id\n      email\n      name\n      role\n      accounts {\n        _id\n        active\n        currency\n        reconciled\n        name\n        transactions\n        balance\n        lastReconciled\n        reconciledBalance\n        type\n      }\n      categoryGroups {\n        categoryGroup\n        categories\n      }\n      payees\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTransactionsFromAccount($accountId: String!) {\n    getTransactionsFromAccount(accountId: $accountId) {\n      _id\n      account\n      approved\n      cleared\n      date\n      currency\n      reconciled\n      scheduledDates\n      scheduled\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTransactionsFromAccount($accountId: String!) {\n    getTransactionsFromAccount(accountId: $accountId) {\n      _id\n      account\n      approved\n      cleared\n      date\n      currency\n      reconciled\n      scheduledDates\n      scheduled\n      transactionDetails {\n        amount\n        category\n        payee\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUsers {\n    getUsers {\n      _id\n      name\n      email\n      role\n    }\n  }\n"): (typeof documents)["\n  query getUsers {\n    getUsers {\n      _id\n      name\n      email\n      role\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;