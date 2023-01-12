import { prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class CategoryGroups {
    @Field(() => String)
    @prop({ required: true })
    categoryGroup: string;

    @Field(() => [String], { defaultValue: [] })
    @prop({ required: true, default: [] })
    categories: string[];
}
