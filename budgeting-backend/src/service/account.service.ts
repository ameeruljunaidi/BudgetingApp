import AddAccountInput from "../schema/account/addAccount.input";
import DeleteAccountInput from "../schema/account/deleteAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import User from "../schema/user.schema";
import path from "path";
import pinoLogger from "../utils/logger";
import UserService from "./user.service";
import Account from "../schema/account.schema";
import { GraphQLError } from "graphql";

const logger = pinoLogger(path.basename(__filename));

const addAccount = async (input: AddAccountInput, userId: string): Promise<Account> => {
    const returnedUser: User = await UserService.getUserById(userId);

    const accountIsNew = returnedUser.accounts.reduce((accum, account) => account.name !== input.name, true);
    if (!accountIsNew) {
        throw new GraphQLError("Account name must be unique", { extensions: { code: "BAD_USER_INPUT" } });
    }

    const updatedUser: User = {
        ...returnedUser,
        accounts: returnedUser.accounts.concat(input as Account),
    };

    const returnedUpdatedUser = await UserService.updateUser(updatedUser);

    const newAccountAdded = returnedUpdatedUser.accounts.find((account) => account.name === input.name);
    if (!newAccountAdded) throw new GraphQLError("Something bad happened when adding new account.");

    return newAccountAdded;
};

const getAccounts = async (input: QueryAccountInput & { user: User["_id"] }) => {};

const deleteAccount = async (input: DeleteAccountInput) => {};

const updateAccount = async (input: UpdateAccountInput) => {};

export default { addAccount, getAccounts, deleteAccount, updateAccount };
