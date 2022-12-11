import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Account from "../schema/account.schema";
import AddAccountInput from "../schema/account/addAccount.input";
import DeleteAccountInput from "../schema/account/deleteAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import AccountService from "../service/account.service";
import Context from "../types/context";

@Resolver()
export default class AccountResolver {
    constructor(private accountService: AccountService) {
        this.accountService = new AccountService();
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    addAccount(@Arg("input") input: AddAccountInput, @Ctx() context: Context) {
        const user = context.user;
        return this.accountService.addAccount({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Query(() => [Account])
    getAccounts(@Arg("input") input: QueryAccountInput, @Ctx() context: Context) {
        const user = context.user;
        return this.accountService.getAccounts({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    updateAccount(@Arg("input") input: UpdateAccountInput) {
        return this.accountService.updateAccount(input);
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    deleteAccount(@Arg("input") input: DeleteAccountInput) {
        return this.accountService.deleteAccount(input);
    }
}
