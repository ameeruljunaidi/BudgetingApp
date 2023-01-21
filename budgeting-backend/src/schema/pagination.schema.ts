import { ArgsType, ClassType, Field, ObjectType } from "type-graphql";

@ArgsType()
export class PaginationArgs {
    @Field(() => Number, { defaultValue: 25 })
    take: number = 25;

    @Field(() => Number)
    skip: number;
}

export type PaginatedResponseType<TItem> = {
    items: TItem[];
    hasMore: boolean;
};

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => [TItemClass])
        items: TItem[];

        @Field()
        hasMore: boolean;
    }

    return PaginatedResponseClass;
}
