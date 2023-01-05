import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Account from "./account.schema";
import Category from "./category.schema";

@modelOptions({ schemaOptions: { _id: false } })
@ObjectType()
class TransactionDetail {
    @Field(() => String)
    @prop({ required: true })
    categoryGroup: string;

    @Field(() => Category)
    @prop({ required: true, type: () => Category })
    category: Category;

    @Field(() => String)
    @prop({ required: true })
    payee: string;

    @Field(() => Number)
    @prop({ required: true, default: 0 })
    amount: number;
}

@ObjectType()
export default class Transaction {
    @Field(() => String)
    _id: string;

    @Field(() => Boolean)
    @prop({required: true, default: false})
    scheduled: boolean;

    @Field(() => [String])
    @prop({required: false, type: () => [String]})
    scheduledDates?: string[]

    @Field(() => String)
    @prop({required: true, ref: "Account", type: () => String})
    account: Ref<Account, string>;

    @Field(() => [TransactionDetail])
    @prop({required: true, type: () => [TransactionDetail]})
    transactionDetails: TransactionDetail[]

    @Field(() => Boolean)
    @prop({required: true, default: false})
    reconciled: boolean;

    @Field(() => Boolean)
    @prop({required: true, default: true})
    approved: boolean;

    @Field(() => String)
    @prop({required: true})
    currency: string;
}

export const TransactionModel = getModelForClass<typeof Transaction>(Transaction);
