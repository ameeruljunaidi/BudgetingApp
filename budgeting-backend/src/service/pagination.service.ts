import { ReturnModelType } from "@typegoose/typegoose";
import { AnyParamConstructor, BeAnObject } from "@typegoose/typegoose/lib/types";
import { PaginatedResponse, PaginatedResponseType } from "../schema/pagination.schema";

const getPagination = <T>(model: ReturnModelType<AnyParamConstructor<any>, BeAnObject>) => {
    const paginate = async (take: number = 25, endId: string | null): Promise<PaginatedResponseType<T>> => {
        const items = endId
            ? await model
                  .find({ _id: { $lt: endId } })
                  .sort({ _id: -1 })
                  .limit(take)
                  .lean()
            : await model.find({}).sort({ _id: -1 }).limit(take).lean();

        const total = items.length;
        const lastId = items[total - 1]._id;

        const next = await model
            .find({ _id: { $lt: lastId } })
            .sort({ _id: -1 })
            .limit(1)
            .lean();

        const hasMore = total == take && !!next;

        return { items, hasMore, total, lastId };
    };

    return paginate;
};

export default getPagination;
