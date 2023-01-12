import { Field, InputType } from "type-graphql";
import AddTransactionInput from "./addTransaction.input";

@InputType()
export default class UpdateTransactionInput extends AddTransactionInput {
    @Field(() => String)
    id: string;

    @Field(() => [String])
    scheduledDates: string[];
}
