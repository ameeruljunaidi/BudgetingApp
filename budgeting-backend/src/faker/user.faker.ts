import User from "../schema/user.schema";
import {
    rand,
    randBetweenDate,
    randCompanyName,
    randDepartment,
    randEmail,
    randFullName,
    randNumber,
    randProductCategory,
} from "@ngneat/falso";
import CategoryGroups from "../schema/category.schema";
import Account from "../schema/account.schema";
import Transaction, { TransactionDetail } from "../schema/transaction.schema";
import mongoose from "mongoose";

const createFakeCategoryGroups = ({ length }: { length: number }): CategoryGroups[] => {
    return [...Array(length)].map(() => ({
        categoryGroup: randProductCategory(),
        categories: randProductCategory({ length: 10 }),
    }));
};

const createFakeAccounts = ({ length }: { length: number }): Account[] => {
    return [...Array(length)].map(
        () =>
            ({
                _id: new mongoose.Types.ObjectId().toString(),
                name: randCompanyName(),
                active: true,
                type: rand(["checking", "credit", "tracking"]),
                balance: randNumber({ min: 10, max: 10000, fraction: 2 }),
                currency: rand(["CAD", "USD", "GBP", "JPY", "EUR", "MYR"]),
                lastReconciled: new Date(),
                reconciled: true,
                transactions: [],
                reconciledBalance: randNumber({ min: 10, max: 1000, fraction: 2 }),
            } satisfies Account)
    );
};

const createFakeUsers = ({ length }: { length: number }): User[] => {
    return [...Array(length)].map(
        () =>
            ({
                _id: new mongoose.Types.ObjectId().toString(),
                name: randFullName(),
                email: randEmail(),
                role: rand(["admin", "user", "guest"]),
                payees: randDepartment({ length: 10 }),
                categoryGroups: createFakeCategoryGroups({ length: 10 }),
                accounts: [],
                password: "testpassword",
            } satisfies User)
    );
};

export const createFakeTransaction = ({
    account,
    user,
    length,
}: {
    account: Account;
    user: User;
    length: number;
}): Transaction[] => {
    return [...Array(length)].map(
        () =>
            ({
                _id: new mongoose.Types.ObjectId().toString(),
                reconciled: true,
                account: account._id,
                approved: true,
                cleared: true,
                date: randBetweenDate({ from: new Date("01/01/2023"), to: new Date() }),
                transactionDetails: [
                    {
                        amount: randNumber({ min: 10, max: 1000, fraction: 2 }),
                        category: rand(user.categoryGroups.flatMap((group) => group.categories)),
                        payee: rand(user.payees),
                    } satisfies TransactionDetail,
                ],
                scheduled: false,
                scheduledDates: [],
                currency: account.currency,
            } satisfies Transaction)
    );
};

export const createFakeData = ({
    userLength,
    accountLength,
    transactionLength,
}: {
    userLength: number;
    accountLength: number;
    transactionLength: number;
}): { users: User[]; transactions: Transaction[] } => {
    const newUsers: User[] = createFakeUsers({ length: userLength });

    let transactions: Transaction[] = [];

    const users: User[] = newUsers.map((user) => {
        const newAccounts: Account[] = createFakeAccounts({ length: accountLength });

        const accounts: Account[] = newAccounts.map((account) => {
            const transactionsToAdd: Transaction[] = createFakeTransaction({
                account,
                user,
                length: transactionLength,
            });
            transactions.push(...transactionsToAdd);

            return { ...account, transactions: transactionsToAdd.map((t) => t._id) } satisfies Account;
        });

        return { ...user, accounts };
    });

    return { users, transactions };
};
