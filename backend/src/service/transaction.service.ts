import { GraphQLError } from "graphql";
import Account, { AccountModel } from "../schema/account.schema";
import Transaction, { TransactionModel } from "../schema/transaction.schema";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import QueryTransactionsInput from "../schema/transaction/queryTransactions.input";
import User from "../schema/user.schema";
import SubCategory, { SubCategoryModel } from "../schema/subCategory.schema";
import UpdateTransactionSubCategoriesInput from "../schema/transaction/updateTransactionSubCategories.input";
import path from "path";

import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));

export default class TransactionService {
    async addTransaction(input: AddTransactionInput & { user: User["_id"] }): Promise<Transaction> {
        logger.info(input, "Adding transaction:");

        // 1.  Find the account to add the transaction to
        // Every transaction needs to be linked to an account
        // Throw error immediately if account is not found
        const returnedAccount = await AccountModel.findOne({ name: input.account }).lean();

        if (!returnedAccount) throw new GraphQLError("Cannot find account.");

        logger.info(returnedAccount, "Account found:");

        // 2. From categories from the input, go through each one and ensure that there are all already in the database
        // User cannot add a transaction to a sub-category that does not exist
        // Throw error immediately if any of the categories provided is not found in the database
        const returnedSubCategories = (await Promise.all(
            input.subCategories.map((cat) => SubCategoryModel.findOne({ name: cat }).lean())
        )) as unknown as SubCategory[];

        const subCategoriesExist: boolean = returnedSubCategories.reduce((acc, cat) => !!cat && acc, true);

        if (!subCategoriesExist) throw new GraphQLError("Cannot find categories");

        logger.info(subCategoriesExist, "Categories exist");

        // Need to convert all the categories to an ID because the schema takes a list of IDs
        const subCategoriesId: string[] = returnedSubCategories.map((category) => category._id);

        logger.info(subCategoriesId, "Sub-Categories ID:");

        // 3. Save the transaction into the database
        // If somehow the database does not return back the transaction throw error immediately
        const returnedTransaction = (await TransactionModel.create({
            ...input,
            account: returnedAccount._id,
            subCategories: subCategoriesId,
        } as Transaction)) as unknown as Transaction;

        if (!returnedTransaction) throw new GraphQLError("Cannot add transaction");

        logger.info(returnedTransaction, "Transaction added:");

        // 4. Update the account with the transaction
        // If fail to update the account, reverse the addition of transaction and throw error
        const updatedAccount: Account = {
            ...returnedAccount,
            transactions: returnedAccount.transactions.concat(returnedTransaction._id),
        };

        const returnedUpdatedAccount = (await AccountModel.findByIdAndUpdate(updatedAccount._id, updatedAccount, {
            new: true,
        })) as unknown as Account;

        if (!returnedUpdatedAccount) {
            // Reverse the addition of transaction
            await TransactionModel.findByIdAndDelete(returnedTransaction._id);
            throw new GraphQLError("Error updating account");
        }

        logger.info(returnedUpdatedAccount, "Account updated:");

        // 5. Add the transaction to the sub-category
        // If fail to update the subCategory, reverse the addition of the transaction and throw error
        await Promise.all(
            returnedSubCategories
                .map((category) => ({
                    ...category,
                    transactions: category.transactions.concat(returnedTransaction._id),
                }))
                .map((category) => SubCategoryModel.findByIdAndUpdate(category._id, category, { new: true }))
        );

        return returnedTransaction;
    }

    async getTransactions(input: QueryTransactionsInput & { user: User["_id"] }): Promise<Transaction[]> {
        const { user, ...params } = input;
        const searchIn = Object.fromEntries(
            Object.entries(params).map(([key, value], _index) => [key, { $in: value }])
        );
        const searchParams = { user, ...searchIn };
        logger.info(searchParams, "Search parameters is:");
        return TransactionModel.find(searchParams);
    }

    async updateTransactionSubCategories(input: UpdateTransactionSubCategoriesInput): Promise<Transaction> {
        // Find the transaction from ID and update the categories on that transaction
        // Find the transaction from the database and throw error if not found
        const returnedTransaction = (await TransactionModel.findById(
            input.transactionId
        ).lean()) as unknown as Transaction;

        if (!returnedTransaction) throw new GraphQLError("Cannot find the transaction in the DB");

        // Get the IDs of all the sub-categories
        const returnedSubCategories = (await Promise.all(
            input.subCategoriesToRemove.map((category) => {
                return SubCategoryModel.findOne({ name: category }).lean();
            })
        )) as unknown as SubCategory[];

        if (!returnedSubCategories) throw new GraphQLError("Cannot find categories in DB");

        logger.info(returnedSubCategories, "Returned sub-categories are");

        const subCategoriesToRemoveId: string[] = returnedSubCategories.map((category) => category._id.toString());

        logger.info(subCategoriesToRemoveId, "Sub-categories IDs are:");

        const subCategories: string[] = returnedTransaction.subCategories
            .map((subCategory) => subCategory!.toString())
            .filter((subCategory) => !subCategoriesToRemoveId.includes(subCategory));

        logger.info(subCategories, "Filtered sub-categories are:");

        // Create new Transaction object that will be used to update the old transaction
        const updatedTransaction: Transaction = {
            ...returnedTransaction,
            subCategories,
        };

        const returnedUpdatedTransactions = await TransactionModel.findByIdAndUpdate(
            updatedTransaction._id,
            updatedTransaction,
            { new: true }
        );

        if (!returnedUpdatedTransactions) throw new GraphQLError("Unable to removed categories from the transaction");

        // Go Through the sub-categories and remove the transaction for the list of transactions
        const returnedUpdatedSubCategories = await Promise.all(
            returnedSubCategories.map((subCategory) => {
                return SubCategoryModel.findByIdAndUpdate(
                    subCategory._id,
                    {
                        ...subCategory,
                        transactions: subCategory.transactions.filter(
                            (transaction) => transaction!.toString() !== input.transactionId
                        ),
                    } as SubCategory,
                    { new: true }
                );
            })
        );

        if (!returnedUpdatedSubCategories) throw new GraphQLError("Unable to update sub-categories");

        return returnedUpdatedTransactions;
    }
}
