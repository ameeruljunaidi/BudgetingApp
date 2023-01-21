import { Field, InputType } from "type-graphql";
import Account from "../account.schema";

@InputType()
export default class EditAccountInput implements Partial<Account> {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    name: string;
}
