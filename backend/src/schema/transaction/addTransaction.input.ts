import { Field, InputType } from "type-graphql";

@InputType()
export default class AddTransactionInput {
    @Field(() => Boolean)
    scheduled: boolean;

    @Field(() => String)
    account: String;

    @Field(() => Number)
    amount: number;

    @Field(() => String)
    payee: string;

    @Field(() => [String])
    subCategories: string[];

    @Field(() => Boolean)
    reconciled: true;

    @Field(() => Boolean)
    approved: boolean;

    @Field(() => String)
    currency: string;
}
