import { Field, InputType } from "type-graphql";

@InputType()
export default class CategoryInput {
    @Field(() => String)
    category: string;

    @Field(() => String)
    categoryGroup: string;
}
