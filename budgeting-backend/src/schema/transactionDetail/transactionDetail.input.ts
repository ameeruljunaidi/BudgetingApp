import { Field, InputType } from "type-graphql";

@InputType()
export default class AddTransactionDetailInput {
    @Field(() => String)
    categoryGroup: string;

    @Field(() => String)
    category: string;

    @Field(() => String)
    payee: string;

    @Field(() => Number)
    amount: number;
}
