import { Field, InputType } from "type-graphql";

@InputType()
export default class SubCategoryInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    parentCategory: string;
}
