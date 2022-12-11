import { Field, InputType } from "type-graphql";
import AddAccountInput from "./addAccount.input";

@InputType()
export default class UpdateAccountInput extends AddAccountInput {
    @Field(() => String)
    id: string;
}
