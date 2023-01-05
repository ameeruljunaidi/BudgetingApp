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
}
