import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import User from "../schema/user.schema";
import CreateUserInput from "../schema/user/createUser.input";
import LoginInput from "../schema/user/login.input";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver()
export default class UserResolver {
    constructor(private userService: UserService) {
        this.userService = new UserService();
    }

    @Mutation(() => User)
    createUser(@Arg("input") input: CreateUserInput) {
        return this.userService.createUser(input);
    }

    @Mutation(() => String)
    login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
        return this.userService.login(input, context);
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() context: Context) {
        return context.user;
    }

    @Authorized("admin")
    @Query(() => [User])
    getUsers() {
        return this.userService.getUsers();
    }

    @Authorized("admin", "user")
    @Mutation(() => User)
    deleteUser(@Ctx() context: Context) {
        return this.userService.deleteUser(context);
    }
}
