import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Transaction from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import TransactionService from "../service/transaction.service";
import Context from "../types/context";
import UpdateTransactionSubCategoriesInput from "../schema/transaction/updateTransactionSubCategories.input";

@Resolver()
export default class TransactionResolver {
    constructor(private transactionService: TransactionService) {
        this.transactionService = new TransactionService();
    }

    @Authorized("admin", "user")
    @Query(() => [Transaction])
    getTransactions(@Arg("input") input: QueryTransactionsInput, @Ctx() context: Context) {
        const user = context.user;
        return this.transactionService.getTransactions({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Mutation(() => Transaction)
    addTransaction(@Arg("input") input: AddTransactionInput, @Ctx() context: Context) {
        const user = context.user;
        return this.transactionService.addTransaction({ ...input, user: user?._id as string });
    }

    @Authorized("admin", "user")
    @Mutation(() => Transaction)
    updateTransactionSubCategories(@Arg("input") input: UpdateTransactionSubCategoriesInput) {
        return this.transactionService.updateTransactionSubCategories(input);
    }
}
