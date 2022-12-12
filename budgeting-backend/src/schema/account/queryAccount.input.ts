import { Field, InputType } from "type-graphql";

@InputType()
export default class QueryAccountInput {
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => [String], { nullable: true })
    currency?: string;

    @Field(() => String, { nullable: true })
    transactions?: string;

    @Field(() => Boolean, { nullable: true })
    active?: boolean;
}
