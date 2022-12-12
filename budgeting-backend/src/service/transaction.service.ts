import { GraphQLError } from "graphql";
import Transaction, { TransactionModel } from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import User from "../schema/user.schema";
import path from "path";

import pinoLogger from "../utils/logger";
import Account from "../schema/account.schema";

const logger = pinoLogger(path.basename(__filename));

const addTransaction = async (input: AddTransactionInput & { user: User["_id"] }): Promise<Transaction> => {
    logger.info(input, "Adding transaction:");

    // 1.  Find the account to add the transaction to
    // Every transaction needs to be linked to an account
    // Throw error immediately if account is not found
    const returnedAccount = {} as Account; // TODO: Fix this

    if (!returnedAccount) throw new GraphQLError("Cannot find account.");

    logger.info(returnedAccount, "Account found:");

    // 2. From categories from the input, go through each one and ensure that there are all already in the database
    // User cannot add a transaction to a sub-categoryGroup that does not exist
    // Throw error immediately if any of the categories provided is not found in the database
    // 3. Save the transaction into the database
    // If somehow the database does not return back the transaction throw error immediately
    const returnedTransaction: Transaction = await TransactionModel.create({
        ...input,
        account: returnedAccount._id,
    });

    if (!returnedTransaction) throw new GraphQLError("Cannot add transaction");

    logger.info(returnedTransaction, "Transaction added:");

    // 4. Update the account with the transaction
    // If fail to update the account, reverse the addition of transaction and throw error
    // const updatedAccount: Account = {
    //     ...returnedAccount,
    //     transactions: returnedAccount.transactions.concat(returnedTransaction._id),
    // };

    const returnedUpdatedAccount: Account = {} as Account; // TODO: Fix this

    if (!returnedUpdatedAccount) {
        // Reverse the addition of transaction
        await TransactionModel.findByIdAndDelete(returnedTransaction._id);
        throw new GraphQLError("Error updating account");
    }

    logger.info(returnedUpdatedAccount, "Account updated:");

    return returnedTransaction;
};

const getTransactions = async (input: QueryTransactionsInput & { user: User["_id"] }): Promise<Transaction[]> => {
    const { user, ...params } = input;
    const searchIn = Object.fromEntries(Object.entries(params).map(([key, value], _index) => [key, { $in: value }]));
    const searchParams = { user, ...searchIn };
    logger.info(searchParams, "Search parameters is:");
    return TransactionModel.find(searchParams);
};

export default { addTransaction, getTransactions };
