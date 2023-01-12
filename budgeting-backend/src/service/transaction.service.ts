import { GraphQLError } from "graphql";
import Transaction, { TransactionModel } from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import User from "../schema/user.schema";
import path from "path";

import myLogger from "../utils/logger";
import Account from "../schema/account.schema";
import UserService from "./user.service";

import _ from "lodash";
import UpdateTransactionInput from "../schema/transaction/updateTransactionInput";
import Context from "../types/context";

const logger = myLogger(path.basename(__filename));

/**
 * Adding transaction will:
 * 1. Throw error if account not found
 * 2. Check that the category/category group does exist (except for reconciler)
 * 3. Update the account to include the new transaction and the new balance
 * 4. Update the user (which holds the account) and also add a payee (if payee does not already exist)
 *
 * @param input: AddTransactionInput & User["_id"]
 * @returns Transaction
 */
const addTransaction = async (input: AddTransactionInput & { user: User["_id"] }): Promise<Transaction> => {
    logger.info(input, "Adding transaction:");

    // 1.  Find the account to add the transaction to
    // Every transaction needs to be linked to an account
    // Throw error immediately if account is not found

    const returnedUser: User = await UserService.getUserById(input.user);
    const returnedAccount: Account | undefined = returnedUser.accounts.find(
        (account) => account.name === input.account
    );
    if (!returnedAccount) throw new GraphQLError("Cannot find account.");
    logger.info(returnedAccount, "Account found:");

    // 2. From categories from the input, go through each one and ensure that there are all already in the database
    // User cannot add a transaction to a sub-categoryGroup that does not exist
    // Throw error immediately if any of the categories provided is not found in the database

    // 3. Save the transaction into the database
    // If somehow the database does not return back the transaction throw error immediately

    const newTransaction = new TransactionModel({ ...input, account: returnedAccount._id });

    // Check if the category group and category exist
    // TODO: Implement category check

    // Ignore if it is a reconciler transactions
    // const isReconciler = (newTransaction: Transaction) => {
    //     const reconciler = "Reconciler";
    //     return (
    //         newTransaction.transactionDetails[0].category === reconciler &&
    //         newTransaction.transactionDetails[0].payee === reconciler
    //     );
    // };

    // if (!isReconciler(newTransaction.toObject())) {
    //     throw new GraphQLError("Category/Category Group does not exist, please create first");
    // }

    newTransaction.markModified("transactionDetail");
    const returnedTransaction = await newTransaction.save();
    if (!returnedTransaction) throw new GraphQLError("Cannot add transaction");

    logger.info(returnedTransaction, "Transaction added:");

    // 4. Update the account with the transaction
    // If fail to update the account, reverse the addition of transaction and throw error
    // const updatedAccount: Account = {
    //     ...returnedAccount,
    //     transactions: returnedAccount.transactions.concat(returnedTransaction._id),
    // };

    const newBalance =
        returnedAccount.balance +
        returnedTransaction.toObject().transactionDetails.reduce((accum, detail) => accum + detail.amount, 0);

    const updatedAccount: Account = {
        ...returnedAccount,
        transactions: returnedAccount.transactions.concat(returnedTransaction._id),
        balance: newBalance,
        reconciled: returnedAccount.balance === newBalance,
    };

    const updatedUser: User = {
        ...returnedUser,
        accounts: returnedUser.accounts.map((account) =>
            account._id === returnedAccount._id ? updatedAccount : account
        ),
        payees: _.union(
            returnedUser.payees,
            returnedTransaction.toObject().transactionDetails.map((detail) => detail.payee)
        ),
    };

    let returnedUpdatedUser: User;

    try {
        returnedUpdatedUser = await UserService.updateUser(updatedUser);
        logger.info(returnedUpdatedUser.accounts, "Account updated:");
    } catch (e) {
        // Reverse the addition of transaction
        await TransactionModel.findByIdAndDelete(returnedTransaction._id);
        throw new GraphQLError(`${e}. Error updating account`);
    }

    return returnedTransaction;
};

const getTransactions = async (input: QueryTransactionsInput & { user: User["_id"] }): Promise<Transaction[]> => {
    const { user, ...params } = input;
    const searchIn = Object.fromEntries(Object.entries(params).map(([key, value], _index) => [key, { $in: value }]));
    const searchParams = { user, ...searchIn };
    logger.info(searchParams, "Search parameters is:");
    return TransactionModel.find(searchParams);
};

const getTransactionsFromAccount = async (user: User | null, accountId: string): Promise<Transaction[]> => {
    if (!user) throw new GraphQLError("Cannot find logged in user");

    const account = user.accounts.find((account) => account._id.toString() === accountId);
    if (!account) throw new GraphQLError("Account not found.");

    const transactions = await TransactionModel.find({ _id: { $in: account.transactions } }).lean();
    if (!transactions) return [];

    return transactions;
};

const updateTransaction = async (transaction: UpdateTransactionInput, userId: string): Promise<Transaction> => {
    // Update transaction but get the old transaction first
    const oldTransaction = await TransactionModel.findById(transaction.id).lean();
    if (!oldTransaction) throw new GraphQLError("Cannot find transaction");

    const updatedTransaction: Transaction = { ...transaction, _id: transaction.id };
    const returnedTransactions = await TransactionModel.findByIdAndUpdate(updatedTransaction._id, updatedTransaction, {
        new: true,
    });

    if (!returnedTransactions) throw new GraphQLError("Error updating user to the DB");
    const newTransaction = returnedTransactions.toObject();

    // Update the balance of the account on user

    logger.info(oldTransaction, "Old transaction:");
    logger.info(newTransaction, "New transaction:");

    const difference =
        newTransaction.transactionDetails.reduce((accum, detail) => accum + detail.amount, 0) -
        oldTransaction.transactionDetails.reduce((accum, detail) => accum + detail.amount, 0);

    const oldUser = await UserService.getUserById(userId);
    const oldAccount = UserService.getAccountById(oldUser, newTransaction.account.toString());
    const newAccount: Account = {
        ...oldAccount,
        balance: oldAccount.balance + difference,
        reconciled: oldAccount.balance === oldAccount.balance + difference,
    };
    const newUser: User = {
        ...oldUser,
        accounts: oldUser.accounts.map((account) =>
            account._id.toString() !== newAccount._id.toString() ? account : newAccount
        ),
    };

    await UserService.updateUser(newUser);

    return returnedTransactions;
};

const deleteTransaction = async (transactionId: string, accountId: string, context: Context): Promise<Transaction> => {
    const userFromContext = context.user;
    if (!userFromContext) throw new GraphQLError("User must be logged in");
    const user = await UserService.getUserById(userFromContext._id);

    const oldTransaction = await TransactionModel.findById(transactionId).lean();
    if (!oldTransaction) throw new GraphQLError("Cannot find transaction to delete");

    const difference = oldTransaction.transactionDetails.reduce((accum, detail) => accum + detail.amount, 0);

    const returnedTransaction = await TransactionModel.findByIdAndDelete(transactionId);
    if (!returnedTransaction) throw new GraphQLError("Failed to removed transaction");

    // This is gnarly, need to refactor this
    await UserService.updateUser({
        ...user,
        accounts: user.accounts.map(
            (account): Account =>
                account._id.toString() !== accountId
                    ? account
                    : {
                          ...account,
                          balance: account.balance - difference,
                          transactions: account.transactions.filter(
                              (transaction) => transaction.toString() !== transactionId
                          ),
                      }
        ),
    });

    return returnedTransaction;
};

export default { addTransaction, getTransactions, getTransactionsFromAccount, updateTransaction, deleteTransaction };
