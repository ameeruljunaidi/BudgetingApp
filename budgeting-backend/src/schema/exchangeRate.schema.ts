import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class ExchangeRate {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @prop({ required: true })
    from: string;

    @Field(() => String)
    @prop({ required: true })
    to: string;

    @Field(() => String)
    @prop({ required: true })
    date: string;

    @Field(() => Number)
    @prop({ required: true })
    amount: number;

    @Field(() => Number)
    @prop({ required: true })
    result: number;
}

export const ExchangeRateModel = getModelForClass<typeof ExchangeRate>(ExchangeRate);
