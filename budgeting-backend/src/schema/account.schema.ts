import { prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Transaction from "./transaction.schema";

@ObjectType()
export default class Account {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true })
    name: string;

    @Field(() => String)
    @prop({ required: true, default: "CAD" })
    currency: string;

    @Field(() => [String], { defaultValue: [], nullable: "items" })
    @prop({ required: true, ref: () => Transaction, type: () => [String], default: [] })
    transactions: Ref<Transaction, string>[];

    @Field(() => Boolean, { defaultValue: true })
    @prop({ required: true, default: true })
    active: boolean;

    @Field(() => Boolean, { defaultValue: true })
    @prop({ required: true, default: true })
    reconciled: boolean;

    // checking, credit, tracking
    @Field(() => String, { defaultValue: "checking" })
    @prop({ required: true, default: "checking" })
    type: string;

    @Field(() => Number, { defaultValue: 0 })
    @prop({ required: true, default: 0 })
    balance: number;

    @Field(() => Date)
    @prop({ required: true })
    lastReconciled: Date;

    @Field(() => Number)
    @prop({ required: true })
    reconciledBalance: number;
}
