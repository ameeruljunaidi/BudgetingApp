/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Account = {
  __typename?: 'Account';
  _id: Scalars['String'];
  active: Scalars['Boolean'];
  balance: Scalars['Float'];
  currency: Scalars['String'];
  lastReconciled: Scalars['DateTime'];
  name: Scalars['String'];
  reconciled: Scalars['Boolean'];
  reconciledBalance: Scalars['Float'];
  transactions: Array<Maybe<Scalars['String']>>;
  type: Scalars['String'];
};

export type AddAccountInput = {
  balance?: InputMaybe<Scalars['Float']>;
  currency?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  type: Scalars['String'];
};

export type AddTransactionDetailInput = {
  amount: Scalars['Float'];
  category: Scalars['String'];
  payee: Scalars['String'];
};

export type AddTransactionInput = {
  account: Scalars['String'];
  approved: Scalars['Boolean'];
  cleared: Scalars['Boolean'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  reconciled: Scalars['Boolean'];
  scheduled: Scalars['Boolean'];
  transactionDetails: Array<AddTransactionDetailInput>;
};

export type CategoryGroups = {
  __typename?: 'CategoryGroups';
  categories: Array<Scalars['String']>;
  categoryGroup: Scalars['String'];
};

export type ConvertCurrencyInput = {
  amount: Scalars['String'];
  date: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
};

export type DeleteAccountInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAccount: Account;
  addCategory: Array<CategoryGroups>;
  addCategoryGroup: Array<CategoryGroups>;
  addTransaction: Transaction;
  createUser: User;
  deleteAccount: Account;
  deleteTransaction: Transaction;
  deleteUser: User;
  login: Scalars['String'];
  reconcileAccount: Account;
  updateAccount: Account;
  updateTransaction: Transaction;
};


export type MutationAddAccountArgs = {
  input: AddAccountInput;
};


export type MutationAddCategoryArgs = {
  category: Scalars['String'];
  categoryGroup: Scalars['String'];
};


export type MutationAddCategoryGroupArgs = {
  categoryGroup: Scalars['String'];
};


export type MutationAddTransactionArgs = {
  input: AddTransactionInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


export type MutationDeleteTransactionArgs = {
  accountId: Scalars['String'];
  transactionId: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationReconcileAccountArgs = {
  accountId: Scalars['String'];
  newBalance: Scalars['Float'];
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateTransactionArgs = {
  transaction: UpdateTransactionInput;
};

export type Query = {
  __typename?: 'Query';
  convertCurrency: Scalars['Float'];
  getAccounts: Array<Account>;
  getTransactions: Array<Transaction>;
  getTransactionsFromAccount: Array<Transaction>;
  getUsers: Array<User>;
  me?: Maybe<User>;
};


export type QueryConvertCurrencyArgs = {
  input: ConvertCurrencyInput;
};


export type QueryGetAccountsArgs = {
  input: QueryAccountInput;
};


export type QueryGetTransactionsArgs = {
  input: QueryTransactionsInput;
};


export type QueryGetTransactionsFromAccountArgs = {
  accountId: Scalars['String'];
};

export type QueryAccountInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  currency?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
  transactions?: InputMaybe<Scalars['String']>;
};

export type QueryTransactionsInput = {
  account?: InputMaybe<Array<Scalars['String']>>;
  amount?: InputMaybe<Array<Scalars['Float']>>;
  approved?: InputMaybe<Array<Scalars['Boolean']>>;
  categories?: InputMaybe<Array<Scalars['String']>>;
  currency?: InputMaybe<Array<Scalars['String']>>;
  payee?: InputMaybe<Array<Scalars['String']>>;
  reconciled?: InputMaybe<Array<Scalars['Boolean']>>;
  scheduled?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['String'];
  account: Scalars['String'];
  approved: Scalars['Boolean'];
  cleared: Scalars['Boolean'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  reconciled: Scalars['Boolean'];
  scheduled: Scalars['Boolean'];
  scheduledDates: Array<Scalars['String']>;
  transactionDetails: Array<TransactionDetail>;
};

export type TransactionDetail = {
  __typename?: 'TransactionDetail';
  amount: Scalars['Float'];
  category: Scalars['String'];
  payee: Scalars['String'];
};

export type UpdateAccountInput = {
  balance?: InputMaybe<Scalars['Float']>;
  currency?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type UpdateTransactionInput = {
  account: Scalars['String'];
  approved: Scalars['Boolean'];
  cleared: Scalars['Boolean'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  reconciled: Scalars['Boolean'];
  scheduled: Scalars['Boolean'];
  scheduledDates: Array<Scalars['String']>;
  transactionDetails: Array<AddTransactionDetailInput>;
};

/** User of the app. */
export type User = {
  __typename?: 'User';
  /** Unique ID of the user. */
  _id: Scalars['String'];
  accounts: Array<Maybe<Account>>;
  categoryGroups: Array<CategoryGroups>;
  /** Unique email of the user. Can be indexed for quicker lookups. */
  email: Scalars['String'];
  /** The name of the user. Does not need to be unique. */
  name: Scalars['String'];
  payees: Array<Scalars['String']>;
  /** Role of the user in the app i.e. Admin, User, or Guest. */
  role: Scalars['String'];
};

export type AddAccountMutationVariables = Exact<{
  input: AddAccountInput;
}>;


export type AddAccountMutation = { __typename?: 'Mutation', addAccount: { __typename?: 'Account', _id: string, active: boolean, name: string, currency: string, reconciled: boolean, transactions: Array<string | null>, type: string, balance: number } };

export type AddTransactionMutationVariables = Exact<{
  input: AddTransactionInput;
}>;


export type AddTransactionMutation = { __typename?: 'Mutation', addTransaction: { __typename?: 'Transaction', _id: string, date: any, account: string, approved: boolean, currency: string, reconciled: boolean, scheduled: boolean, scheduledDates: Array<string>, transactionDetails: Array<{ __typename?: 'TransactionDetail', category: string, amount: number, payee: string }> } };

export type DeleteTransactionMutationVariables = Exact<{
  accountId: Scalars['String'];
  transactionId: Scalars['String'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: { __typename?: 'Transaction', _id: string, account: string, transactionDetails: Array<{ __typename?: 'TransactionDetail', amount: number, category: string, payee: string }> } };

export type ReconcileAccountMutationVariables = Exact<{
  newBalance: Scalars['Float'];
  accountId: Scalars['String'];
}>;


export type ReconcileAccountMutation = { __typename?: 'Mutation', reconcileAccount: { __typename?: 'Account', _id: string, active: boolean, balance: number, currency: string, lastReconciled: any, name: string, reconciled: boolean, reconciledBalance: number, transactions: Array<string | null>, type: string } };

export type UpdateTransactionMutationVariables = Exact<{
  transaction: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', _id: string, account: string, approved: boolean, cleared: boolean, currency: string, date: any, reconciled: boolean, scheduled: boolean, scheduledDates: Array<string>, transactionDetails: Array<{ __typename?: 'TransactionDetail', amount: number, category: string, payee: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: string, email: string, name: string, role: string, payees: Array<string>, accounts: Array<{ __typename?: 'Account', _id: string, active: boolean, currency: string, reconciled: boolean, name: string, transactions: Array<string | null>, balance: number, lastReconciled: any, reconciledBalance: number, type: string } | null>, categoryGroups: Array<{ __typename?: 'CategoryGroups', categoryGroup: string, categories: Array<string> }> } | null };

export type GetTransactionsFromAccountQueryVariables = Exact<{
  accountId: Scalars['String'];
}>;


export type GetTransactionsFromAccountQuery = { __typename?: 'Query', getTransactionsFromAccount: Array<{ __typename?: 'Transaction', _id: string, account: string, approved: boolean, cleared: boolean, date: any, currency: string, reconciled: boolean, scheduledDates: Array<string>, scheduled: boolean, transactionDetails: Array<{ __typename?: 'TransactionDetail', amount: number, category: string, payee: string }> }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: string, name: string, email: string, role: string }> };


export const AddAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]} as unknown as DocumentNode<AddAccountMutation, AddAccountMutationVariables>;
export const AddTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"approved"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDates"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"payee"}}]}}]}}]}}]} as unknown as DocumentNode<AddTransactionMutation, AddTransactionMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"payee"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const ReconcileAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReconcileAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newBalance"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reconcileAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newBalance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newBalance"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"lastReconciled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"reconciledBalance"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<ReconcileAccountMutation, ReconcileAccountMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"approved"}},{"kind":"Field","name":{"kind":"Name","value":"cleared"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDates"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"payee"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"lastReconciled"}},{"kind":"Field","name":{"kind":"Name","value":"reconciledBalance"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryGroup"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payees"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetTransactionsFromAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTransactionsFromAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTransactionsFromAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"account"}},{"kind":"Field","name":{"kind":"Name","value":"approved"}},{"kind":"Field","name":{"kind":"Name","value":"cleared"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reconciled"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledDates"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"payee"}}]}}]}}]}}]} as unknown as DocumentNode<GetTransactionsFromAccountQuery, GetTransactionsFromAccountQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;