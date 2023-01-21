import path from "path";
import myLogger from "../utils/logger";
import mongoose from "mongoose";
import config from "../utils/config";
import { createFakeData } from "./user.faker";
import { UserModel } from "../schema/user.schema";
import { TransactionModel } from "../schema/transaction.schema";

const logger = myLogger(path.basename(__filename));

(async () => {
    try {
        mongoose.set("strictQuery", false); // Remove for Mongoose 7 later
        await mongoose.connect(config.MONGODB_URI(), { autoIndex: true });
        await mongoose.connection.syncIndexes(); // fixed unique not working: https://dev.to/akshatsinghania/mongoose-unique-not-working-16bf
        logger.info(`Successfully connected to MongoDB in ${config.MODE} mode`);

        const collections = await mongoose.connection.db.collections();
        await Promise.all(collections.map((collection) => collection.deleteMany({})));
        logger.info("DB successfully reset.");

        const { users, transactions } = createFakeData({ userLength: 1, accountLength: 5, transactionLength: 200 });
        const userPromises = users.map((user) => UserModel.create(user));
        const transactionPromises = transactions.map((transaction) => TransactionModel.create(transaction));
        await Promise.all(userPromises);
        await Promise.all(transactionPromises);
        logger.info("Successfully added fake data.");

        process.exit(0);
    } catch (error) {
        logger.fatal("Error creating fake data.");
        if (error instanceof Error) logger.fatal(error.message);

        process.exit(1);
    }
})();
