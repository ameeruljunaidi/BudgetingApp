import {Field, InputType} from "type-graphql";
import AddTransactionDetailInput from "../transactionDetail/transactionDetail.input";

@InputType()
export default class AddTransactionInput {
    @Field(() => Boolean)
    scheduled: boolean;

    @Field(() => String)
    account: String;

    @Field(() => [AddTransactionDetailInput])
    transactionDetail: AddTransactionDetailInput[];

    @Field(() => Boolean)
    reconciled: boolean;

    @Field(() => Boolean)
    approved: boolean;

    @Field(() => String)
    currency: string;
}
