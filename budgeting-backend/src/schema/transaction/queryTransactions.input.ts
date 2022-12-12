import { Field, InputType } from "type-graphql";

@InputType()
export default class QueryTransactionsInput {
    @Field(() => [Boolean], { nullable: true })
    scheduled?: boolean[];

    @Field(() => [String], { nullable: true })
    account?: string[];

    @Field(() => [Number], { nullable: true })
    amount?: number[];

    @Field(() => [String], { nullable: true })
    payee?: string[];

    @Field(() => [String], { nullable: true })
    categories?: string[];

    @Field(() => [Boolean], { nullable: true })
    reconciled?: true[];

    @Field(() => [Boolean], { nullable: true })
    approved?: boolean[];

    @Field(() => [String], { nullable: true })
    currency?: string[];
}
