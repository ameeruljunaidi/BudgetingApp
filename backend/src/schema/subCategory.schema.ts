import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Category from "./category.schema";
import Transaction from "./transaction.schema";

@ObjectType()
export default class SubCategory {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true })
    name: string;

    @Field(() => String)
    @prop({ required: true, ref: "Category" })
    parentCategory: Ref<Category>;

    @Field(() => [String])
    @prop({ required: true, ref: () => Transaction })
    transactions: Ref<Transaction>[];
}

export const SubCategoryModel = getModelForClass<typeof SubCategory>(SubCategory);
