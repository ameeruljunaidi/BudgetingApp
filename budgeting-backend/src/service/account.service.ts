import AddAccountInput from "../schema/account/addAccount.input";
import DeleteAccountInput from "../schema/account/deleteAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import User from "../schema/user.schema";
import path from "path";
import myLogger from "../utils/logger";
import UserService from "./user.service";
import Account from "../schema/account.schema";
import { GraphQLDeprecatedDirective, GraphQLError } from "graphql";
import transactionService from "./transaction.service";

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

const deleteAccount = async (input: DeleteAccountInput) => {};

const updateAccount = async (input: UpdateAccountInput) => {};

const reconcileAccount = async (accountId: string, userId: User["_id"], newBalance: number): Promise<Account> => {
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
        return UserService.getAccountById(savedUser, accountId);
    }

    await transactionService.addTransaction({
        account: account.name,
        approved: true,
        cleared: true,
        currency: account.currency,
        date: new Date(),
        reconciled: true,
        scheduled: false,
        transactionDetails: [{ amount: difference, category: "Reconciler", payee: "Reconciler" }],
        user: userId,
    });

    const newUser = await UserService.getUserById(userId);
    const newAccount = UserService.getAccountById(newUser, accountId);
    if (newAccount.balance !== newBalance) {
        throw new GraphQLError("Something bad happened when adding reconciler balance.");
    }

    const updatedAccount: Account = {
        ...newAccount,
        reconciledBalance: newBalance,
        lastReconciled: new Date(),
    };

    const updatedUser: User = {
        ...newUser,
        accounts: newUser.accounts.map((account) => (account._id.toString() !== accountId ? account : updatedAccount)),
    };

    const savedUser = await UserService.updateUser(updatedUser);
    return UserService.getAccountById(savedUser, accountId);
};

export default { addAccount, getAccounts, deleteAccount, updateAccount, reconcileAccount };
