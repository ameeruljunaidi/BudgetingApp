import { Field, InputType } from "type-graphql";
import User from "../user.schema";

@InputType()
export default class LoginInput implements Partial<User> {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
