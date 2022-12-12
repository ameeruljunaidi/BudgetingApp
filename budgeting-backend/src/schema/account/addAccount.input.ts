import { Field, InputType } from "type-graphql";
import Account from "../account.schema";

@InputType()
export default class AddAccountInput implements Partial<Account> {
    @Field(() => String)
    name: string;

    @Field(() => String)
    currency?: string;
}
