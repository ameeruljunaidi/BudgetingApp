import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Role } from "../user.schema";

@InputType()
export default class CreateUserInput {
    @Field(() => String)
    name: string;

    @IsEmail()
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String, { nullable: true, defaultValue: "user" })
    role?: Role;
}
