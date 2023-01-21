import { Field, InputType } from "type-graphql";

@InputType()
export default class DeleteAccountInput {
    @Field(() => String)
    id: string;
}
