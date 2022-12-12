import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import User from "../schema/user.schema";
import CreateUserInput from "../schema/user/createUser.input";
import LoginInput from "../schema/user/login.input";
import UserService from "../service/user.service";
import Context from "../types/context";
import Account from "../schema/account.schema";
import AddAccountInput from "../schema/account/addAccount.input";
import QueryAccountInput from "../schema/account/queryAccount.input";
import UpdateAccountInput from "../schema/account/updateAccount.input";
import DeleteAccountInput from "../schema/account/deleteAccount.input";
import AccountService from "../service/account.service";

@Resolver()
export default class UserResolver {
    @Mutation(() => User)
    createUser(@Arg("input") input: CreateUserInput) {
        return UserService.createUser(input);
    }

    @Mutation(() => String)
    login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
        return UserService.login(input, context);
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() context: Context) {
        return context.user;
    }

    @Authorized("admin")
    @Query(() => [User])
    getUsers() {
        return UserService.getUsers();
    }

    @Authorized("admin", "user")
    @Mutation(() => User)
    deleteUser(@Ctx() context: Context) {
        return UserService.deleteUser(context);
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    addAccount(@Arg("input") input: AddAccountInput, @Ctx() context: Context) {
        return AccountService.addAccount(input, context.user!._id);
    }

    @Authorized("admin", "user")
    @Query(() => [Account])
    getAccounts(@Arg("input") input: QueryAccountInput, @Ctx() context: Context) {
        const user = context.user;
        return AccountService.getAccounts({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    updateAccount(@Arg("input") input: UpdateAccountInput) {
        return AccountService.updateAccount(input);
    }

    @Authorized("admin", "user")
    @Mutation(() => Account)
    deleteAccount(@Arg("input") input: DeleteAccountInput) {
        return AccountService.deleteAccount(input);
    }
}
