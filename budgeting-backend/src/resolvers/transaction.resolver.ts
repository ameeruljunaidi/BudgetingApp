import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Transaction from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import TransactionService from "../service/transaction.service";
import Context from "../types/context";

@Resolver()
export default class TransactionResolver {
    @Authorized("admin", "user")
    @Query(() => [Transaction])
    getTransactions(@Arg("input") input: QueryTransactionsInput, @Ctx() context: Context) {
        const user = context.user;
        return TransactionService.getTransactions({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Mutation(() => Transaction)
    addTransaction(@Arg("input") input: AddTransactionInput, @Ctx() context: Context) {
        const user = context.user;
        return TransactionService.addTransaction({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Query(() => [Transaction])
    getTransactionsFromAccount(@Ctx() context: Context, @Arg("accountId") accountId: string) {
        return TransactionService.getTransactionsFromAccount(context.user, accountId);
    }
}
