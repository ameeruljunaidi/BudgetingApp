import { Field, InputType } from "type-graphql";

@InputType()
export default class UpdateTransactionSubCategoriesInput {
    @Field(() => String)
    transactionId: string;

    @Field(() => [String])
    subCategoriesToRemove: string[];
}
