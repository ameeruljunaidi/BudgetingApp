import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Transaction from "./transaction.schema";
import User from "./user.schema";

@ObjectType()
export default class Account {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true, ref: "User", unique: true })
    user: Ref<User>;

    @Field(() => String)
    @prop({ required: true, unique: true })
    name: string;

    @Field(() => String)
    @prop({ required: true, default: "CAD" })
    currency: string;

    @Field(() => [String])
    @prop({ required: true, ref: () => Transaction, type: () => [String] })
    transactions: Ref<Transaction>[];

    @Field(() => Boolean)
    @prop({ required: true, default: true })
    active: boolean;

    @Field(() => Boolean)
    @prop({ required: true, default: true })
    reconciled: boolean;
}

export const AccountModel = getModelForClass<typeof Account>(Account);
