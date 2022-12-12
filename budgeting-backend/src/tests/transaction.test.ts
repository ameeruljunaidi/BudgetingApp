import testUtils from "./testUtils/testUtils";
import User from "../schema/user.schema";
import usersData from "./testData/users.data.json";
import assert from "assert";
import AddTransactionInput from "../schema/transaction/addTransaction.input";
import Account from "../schema/account.schema";
import Transaction from "../schema/transaction.schema";

const AddTransaction = `#graphl
    mutation AddTransaction($input: AddTransactionInput!) {
        addTransaction(input: $input) {
            scheduled
            account
            amount
            user
            payee
            subCategories
            reconciled
            approved
            currency
        }
    }
`;

const testUser = usersData[0] as User;

let user: User;
let account: Account;

beforeAll(async () => {
    const subCategoriesToAdd = ["First Expense", "Second Expense"];

    await testUtils.resetDatabase();
    user = await testUtils.addTestUser(testUser);
    // TODO: Add account
    // account = await testUtils.addTestAccount("Tom's Account", user._id);
});

describe("Transaction basic functions", () => {
    it("can add a transaction", async () => {
        const variables = {
            input: {
                scheduled: true,
                account: "Tom's Account",
                amount: 42.69,
                payee: "Lamborghinies",
                subCategories: ["First Expense", "Second Expense"],
                reconciled: true,
                approved: true,
                currency: "USD",
            },
        } as unknown as AddTransactionInput;

        const response = await testUtils
            .testServer()
            .executeOperation({ query: AddTransaction, variables }, { contextValue: { user } });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeUndefined();

        assert(response.body.singleResult.data?.addTransaction);
        const transactionFromResponse: Transaction = response.body.singleResult.data?.addTransaction as Transaction;
        expect(transactionFromResponse).toHaveProperty("scheduled", true);
        expect(transactionFromResponse).toHaveProperty("reconciled", true);
        expect(transactionFromResponse).toHaveProperty("approved", true);
    });
});
