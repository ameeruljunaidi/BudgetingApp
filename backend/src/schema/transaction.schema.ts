import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Account from "./account.schema";
import SubCategory from "./subCategory.schema";
import User from "./user.schema";

@ObjectType()
export default class Transaction {
    @Field(() => String)
    _id: string;

    @Field(() => Boolean)
    @prop({ required: true, default: false })
    scheduled: boolean;

    // Add field for scheduled dates

    @Field(() => String)
    @prop({ required: true, ref: "Account" })
    account: Ref<Account>;

    @Field(() => String)
    @prop({ required: true, ref: "User" })
    user: Ref<User>;

    @Field(() => Number)
    @prop({ required: true })
    amount: number;

    @Field(() => String)
    @prop({ required: true })
    payee: string;

    @Field(() => [String])
    @prop({ required: true, ref: "SubCategory", type: () => [String] })
    subCategories: Ref<SubCategory>[];

    @Field(() => Boolean)
    @prop({ required: true, default: false })
    reconciled: boolean;

    @Field(() => Boolean)
    @prop({ required: true, default: true })
    approved: boolean;

    @Field(() => String)
    @prop({ required: true })
    currency: string;
}

export const TransactionModel = getModelForClass<typeof Transaction>(Transaction);
