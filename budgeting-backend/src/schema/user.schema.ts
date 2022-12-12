import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { Length } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import Account from "./account.schema";
import Category from "./category.schema";
import descriptions from "../utils/descriptions";

export type Role = "admin" | "user" | "guest";

@pre<User>("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hashSync(this.password, salt);
})
@ObjectType({ description: descriptions.USER })
export default class User {
    @Field(() => String, { description: descriptions.USER_ID })
    _id: string;

    @Length(6, 50)
    @Field(() => String, { description: descriptions.USER_NAME })
    @prop({ required: true })
    name: string;

    @Field(() => String, { description: descriptions.USER_EMAIL })
    @prop({ required: true, unique: true })
    email: string;

    @Length(6, 50)
    @prop({ required: true })
    password: string;

    @Field(() => String, { description: descriptions.USER_ROLE })
    @prop({ required: true, default: "user" })
    role: string;

    @Field(() => [Account], { defaultValue: [], nullable: "items" })
    @prop({ required: true, type: () => [Account], default: [] })
    accounts: Account[];

    @Field(() => [String])
    @prop({ required: true, type: () => [String], default: ["Main Category Group"] })
    categoryGroups: string[];

    @Field(() => [Category])
    @prop({ required: true, type: () => [Category], default: [] })
    categories: Category[];

    @Field(() => [String])
    @prop({ required: true, type: () => [String], default: ["Main Payee"] })
    payees: string[];
}

export const UserModel = getModelForClass<typeof User>(User);
