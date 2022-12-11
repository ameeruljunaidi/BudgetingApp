import { GraphQLError } from "graphql";
import Account, { AccountModel } from "../schema/account.schema";
import AddAccountInput from "../schema/account/addAccount.input";
import DeleteAccountInput from "../schema/account/deleteAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import User, { UserModel } from "../schema/user.schema";
import UserService from "./user.service";
import path from "path";

import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));
export default class AccountService {
    async addAccount(input: AddAccountInput & { user: User["_id"] }): Promise<Account> {
        const returnedUser: User = await UserService.getUserById(input.user);

        const toAdd = { ...input, transactions: [], active: true, reconciled: true } as Omit<Account, "_id">;

        const returnedAccount = await AccountModel.create(toAdd);
        if (!returnedAccount) throw new GraphQLError("Cannot add account");

        const updatedUser: User = {
            ...returnedUser,
            accounts: returnedUser.accounts.concat(returnedAccount._id),
        };

        const returnUpdatedUser = await UserModel.findByIdAndUpdate(updatedUser._id, updatedUser, {
            new: true,
        });

        if (!returnUpdatedUser) {
            await AccountModel.findByIdAndDelete(returnedAccount._id);
            throw new GraphQLError("Error updating user.");
        }

        return returnedAccount;
    }

    async getAccounts(input: QueryAccountInput & { user: User["_id"] }): Promise<Account[]> {
        // Change this since user has accounts
        const { user, ...params } = input;
        const searchIn = Object.fromEntries(
            Object.entries(params).map(([key, value], _index) => [key, { $in: value }])
        );
        const searchParams = { user, ...searchIn };
        logger.info("Search parameters is");
        return AccountModel.find(searchParams);
    }

    async deleteAccount(input: DeleteAccountInput): Promise<Account> {
        const returnedAccount = await AccountModel.findOneAndDelete(input);

        if (!returnedAccount) {
            throw new GraphQLError("Cannot find account.", {
                extensions: { code: "BAD_USE_INPUT" },
            });
        }

        return returnedAccount;
    }

    async updateAccount(input: UpdateAccountInput): Promise<Account> {
        const updatedAccount = { ...input, _id: input.id };
        const returnedAccount = await AccountModel.findByIdAndUpdate(input.id, updatedAccount, { new: true });

        if (!returnedAccount) {
            throw new GraphQLError("Cannot find account.", {
                extensions: { code: "BAD_USE_INPUT" },
            });
        }

        return returnedAccount;
    }
}
