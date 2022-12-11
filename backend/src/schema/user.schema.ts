import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { Length } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import Account from "./account.schema";
import Category from "./category.schema";

export type Role = "admin" | "user" | "guest";

@pre<User>("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(this.password, salt);
    this.password = hash;
})
@ObjectType()
export default class User {
    @Field(() => String)
    _id: string;

    @Length(6, 50)
    @Field(() => String)
    @prop({ required: true })
    name: string;

    @Field(() => String)
    @prop({ required: true, unique: true })
    email: string;

    @Length(6, 50)
    @prop({ required: true })
    password: string;

    @Field(() => String)
    @prop({ required: true, default: "user" })
    role: Role;

    // TODO: Refactor this to include the accounts as sub-documents
    @Field(() => [String])
    @prop({ required: true, ref: () => Account, type: () => [String] })
    accounts: Ref<Account>[];

    // TODO: Removed this, the categories will be a documents under accounts
    @Field(() => [String])
    @prop({ required: true, ref: () => Category, type: () => [String] })
    categories: Ref<Category>[];
}

export const UserModel = getModelForClass<typeof User>(User);
