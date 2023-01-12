import { Ref } from "@typegoose/typegoose";
import { Field, InputType } from "type-graphql";
import Account from "../account.schema";
import AddTransactionDetailInput from "../transactionDetail/transactionDetail.input";

@InputType()
export default class AddTransactionInput {
    @Field(() => Date)
    date: Date;

    @Field(() => Boolean)
    scheduled: boolean;

    @Field(() => String)
    account: Ref<Account, string>;

    @Field(() => [AddTransactionDetailInput])
    transactionDetails: AddTransactionDetailInput[];

    @Field(() => Boolean)
    reconciled: boolean;

    @Field(() => Boolean)
    approved: boolean;

    @Field(() => String)
    currency: string;

    @Field(() => Boolean)
    cleared: boolean;
}
