import { GraphQLError } from "graphql";
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Transaction from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import UpdateTransactionInput from "../schema/transaction/updateTransactionInput";
import TransactionService from "../service/transaction.service";
import Context from "../types/context";
import { PaginatedResponse, PaginationArgs } from "../schema/pagination.schema";

const PaginatedTransactions = PaginatedResponse<Transaction>(Transaction);

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

    @Authorized("admin", "user")
    @Query(() => PaginatedTransactions)
    getTransactionsFromAccountPaginated(
        @Ctx() context: Context,
        @Arg("accountId") accountId: string,
        @Args() { take, skip }: PaginationArgs
    ) {
        return TransactionService.getTransactionFromAccountPaginated(context, accountId, take, skip);
    }

    @Authorized("admin", "user")
    @Mutation(() => Transaction)
    updateTransaction(@Arg("transaction") transaction: UpdateTransactionInput, @Ctx() context: Context) {
        if (!context.user) throw new GraphQLError("User must be logged in to update transaction");
        return TransactionService.updateTransaction(transaction, context.user._id);
    }

    @Authorized("admin", "user")
    @Mutation(() => Transaction)
    deleteTransaction(
        @Arg("transactionId") transactionId: string,
        @Arg("accountId") accountId: string,
        @Ctx() context: Context
    ) {
        return TransactionService.deleteTransaction(transactionId, accountId, context);
    }
}
