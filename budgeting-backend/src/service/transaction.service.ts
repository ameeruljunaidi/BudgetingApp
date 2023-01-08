import { GraphQLError } from "graphql";
import Transaction, { TransactionDetail, TransactionModel } from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import User, { UserModel } from "../schema/user.schema";
import path from "path";

import myLogger from "../utils/logger";
import Account from "../schema/account.schema";
import UserService from "./user.service";
import AddTransactionDetailInput from "../schema/transactionDetail/transactionDetail.input";

const logger = myLogger(path.basename(__filename));

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
    const categoryCheck =
        returnedUser.categories.find((category) =>
            input.transactionDetails.find((detail) => detail.category === category)
        ) &&
        returnedUser.categoryGroups.find((categoryGroup) =>
            input.transactionDetails.find((detail) => detail.categoryGroup === categoryGroup)
        );
    if (!categoryCheck) throw new GraphQLError("Category/Category Group does not exist, please create first");

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

    const updatedAccount: Account = {
        ...returnedAccount,
        transactions: returnedAccount.transactions.concat(returnedTransaction._id),
    };

    const updatedUser: User = {
        ...returnedUser,
        accounts: returnedUser.accounts.map((account) =>
            account._id === returnedAccount._id ? updatedAccount : account
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

export default { addTransaction, getTransactions, getTransactionsFromAccount };
