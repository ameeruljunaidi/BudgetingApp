import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import SubCategory from "./subCategory.schema";

@ObjectType()
export default class Category {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true, unique: true })
    name: string;

    @Field(() => [String])
    @prop({ required: true, ref: () => SubCategory, type: () => [String] })
    subCategories: Ref<SubCategory>[];
}

export const CategoryModel = getModelForClass<typeof Category>(Category);
