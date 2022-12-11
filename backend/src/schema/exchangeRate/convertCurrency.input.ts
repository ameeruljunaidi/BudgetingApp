import { Field, InputType } from "type-graphql";

@InputType()
export default class ConvertCurrencyInput {
    @Field(() => String)
    from: string;

    @Field(() => String)
    to: string;

    @Field(() => String)
    date: string;

    @Field(() => String)
    amount: number;
}
