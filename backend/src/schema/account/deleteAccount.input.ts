import { Field, InputType } from "type-graphql";

@InputType()
export default class DeleteAccountInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    id: string;
}
