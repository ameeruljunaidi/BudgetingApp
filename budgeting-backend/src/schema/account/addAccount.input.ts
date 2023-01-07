import { Field, InputType } from "type-graphql";
import Account from "../account.schema";

@InputType()
export default class AddAccountInput implements Partial<Account> {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    currency?: string;

    @Field(() => String)
    type: string;

    @Field(() => Number, { nullable: true })
    balance?: number;
}
