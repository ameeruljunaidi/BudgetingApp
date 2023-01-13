import AddAccountInput from "../schema/account/addAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import User from "../schema/user.schema";
import path from "path";
import myLogger from "../utils/logger";
import UserService from "./user.service";
import Account from "../schema/account.schema";
import { GraphQLError } from "graphql";
import TransactionService from "./transaction.service";
import Transaction, { TransactionModel } from "../schema/transaction.schema";
import Context from "../types/context";

const logger = myLogger(path.basename(__filename));

const addAccount = async (input: AddAccountInput, userId: string): Promise<Account> => {
    const returnedUser: User = await UserService.getUserById(userId);
    logger.info(returnedUser, "Returned user to add account");

    const accountIsNew = returnedUser.accounts.reduce((accum, account) => accum && account.name !== input.name, true);
    if (!accountIsNew) {
        throw new GraphQLError("Account name must be unique", { extensions: { code: "BAD_USER_INPUT" } });
    }

    logger.info(accountIsNew, "Account is new:");

    type NewAccountForMongo = Omit<Account, "_id" | "transactions" | "active" | "reconciled" | "currency" | "balance">;

    const newAccount: NewAccountForMongo = {
        ...input,
        lastReconciled: new Date(),
        reconciledBalance: input.balance ?? 0,
    };

    const updatedUser: User = {
        ...returnedUser,
        accounts: returnedUser.accounts.concat(newAccount as Account), // Default values set by typegoose
    };

    const returnedUpdatedUser = await UserService.updateUser(updatedUser);

    const newAccountAdded = returnedUpdatedUser.accounts.find((account) => account.name === input.name);
    if (!newAccountAdded) throw new GraphQLError("Something bad happened when adding new account.");

    return newAccountAdded;
};

const getAccounts = async (input: QueryAccountInput & { user: User["_id"] }): Promise<Account[]> => {
    const returnedUser: User = await UserService.getUserById(input.user);
    // TODO: Fix search query
    return returnedUser.accounts;
};

const deleteAccount = async (context: Context, accountId: string): Promise<Account> => {
    const user = context.user;
    if (!user) throw new GraphQLError("User must be logged in to delete an account.");

    const account = user.accounts.find((account) => account._id.toString() === accountId);
    if (!account) throw new GraphQLError("Cannot find account from user.");

    const transactions = await Promise.all(
        account.transactions.map((transaction) => TransactionModel.findByIdAndDelete(transaction.toString()))
    );

    logger.info(`${transactions.length} transactions deleted from deleting acccount.`);

    const getUser = await UserService.getUserById(user._id);

    const updatedUser: User = {
        ...getUser,
        accounts: user.accounts.filter((account) => account._id.toString() !== accountId),
    };

    await UserService.updateUser(updatedUser);

    return account;
};

const updateAccount = async (input: UpdateAccountInput) => {
};

const convertClearedTransactions = async (accountId: Account["_id"], userId: User["_id"]): Promise<Transaction[]> => {
    const user = await UserService.getUserById(userId);

    const transactions = await TransactionService.getTransactionsFromAccount(user, accountId);
    const updatedTransactions: Transaction[] = transactions
        .filter((transaction) => transaction.cleared)
        .map((transaction) => ({ ...transaction, reconciled: true }));

    const updateTransactionsPromises = updatedTransactions.map((transaction) =>
        TransactionModel.findByIdAndUpdate(transaction._id, transaction, { new: true })
    );
    const resolvedTransactionsDocs = await Promise.all(updateTransactionsPromises);
    return resolvedTransactionsDocs.map((docs) => docs?.toObject() as Transaction).filter((transaction) => transaction);
};

const reconcileAccount = async (
    accountId: Account["_id"],
    userId: User["_id"],
    newBalance: number
): Promise<Account> => {
    const user = await UserService.getUserById(userId);
    const account = UserService.getAccountById(user, accountId);
    const difference = newBalance - account.balance;
    logger.info(difference, "The difference is");
    if (!difference) {
        const updatedAccount: Account = { ...account, lastReconciled: new Date() };
        const updatedUser: User = {
            ...user,
            accounts: user.accounts.map((account) => (account._id.toString() !== accountId ? account : updatedAccount)),
        };
        const savedUser = await UserService.updateUser(updatedUser);
        await convertClearedTransactions(accountId, userId);
        return UserService.getAccountById(savedUser, accountId);
    }
    await TransactionService.addTransaction({
        account: account.name,
        approved: true,
        cleared: true,
        currency: account.currency,
        date: new Date(),
        reconciled: true,
        scheduled: false,
        transactionDetails: [ { amount: difference, category: "Reconciler", payee: "Reconciler" } ],
        user: userId,
    });
    const newUser = await UserService.getUserById(userId);
    const newAccount = UserService.getAccountById(newUser, accountId);
    if (newAccount.balance !== newBalance)
        throw new GraphQLError("Something bad happened when adding reconciler balance.");
    const updatedAccount: Account = {
        ...newAccount,
        reconciled: true,
        reconciledBalance: newBalance,
        lastReconciled: new Date(),
    };
    const updatedUser: User = {
        ...newUser,
        accounts: newUser.accounts.map((account) => (account._id.toString() !== accountId ? account : updatedAccount)),
    };
    await convertClearedTransactions(accountId, userId);
    const savedUser = await UserService.updateUser(updatedUser);
    return UserService.getAccountById(savedUser, accountId);
};

export default { addAccount, getAccounts, deleteAccount, updateAccount, reconcileAccount };
