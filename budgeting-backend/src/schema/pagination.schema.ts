import { ArgsType, ClassType, Field, ObjectType } from "type-graphql";

@ArgsType()
export class PaginationArgs {
    @Field(() => Number, { defaultValue: 25 })
    take: number = 25;

    @Field(() => String, { nullable: true })
    endId?: string;
}

export type PaginatedResponseType<TItem> = {
    items: TItem[];
    total: number;
    hasMore: boolean;
    lastId?: string;
};

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => [TItemClass])
        items: TItem[];

        @Field(() => Number)
        total: number;

        @Field()
        hasMore: boolean;

        @Field({ nullable: true })
        lastId?: string;
    }

    return PaginatedResponseClass;
}
