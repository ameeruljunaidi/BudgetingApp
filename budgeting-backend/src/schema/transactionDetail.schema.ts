import { Field, ObjectType } from "type-graphql";
import { modelOptions, prop } from "@typegoose/typegoose";
import Category from "./category.schema";

@modelOptions({ schemaOptions: { _id: false } })
@ObjectType()
export default class TransactionDetail {
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
