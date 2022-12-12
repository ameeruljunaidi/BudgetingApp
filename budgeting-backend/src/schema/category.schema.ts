import { Field, ObjectType } from "type-graphql";
import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
@ObjectType()
export default class Category {
    @Field(() => String)
    @prop()
    categoryGroup: string;

    @Field(() => String)
    @prop()
    category: string;
}
