import { ApolloServer, ApolloServerOptions } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import context from "../../utils/context";
import resolvers from "../../resolvers";
import authChecker from "../../utils/authChecker";
import config from "../../utils/config";
import mongoose from "mongoose";
import TestContext from "./testContext";
import User, { UserModel } from "../../schema/user.schema";
import { DocumentType } from "@typegoose/typegoose";
import CreateUserInput from "../../schema/user/createUser.input";
import assert from "assert";
import Category, { CategoryModel } from "../../schema/category.schema";
import CategoryInput from "../../schema/category/category.input";
import SubCategory, { SubCategoryModel } from "../../schema/subCategory.schema";
import SubCategoryInput from "../../schema/subCategory/subCategory.input";
import Account, { AccountModel } from "../../schema/account.schema";
import path from "path";
import pinoLogger from "../../utils/logger";

const logger = pinoLogger(path.basename(__filename));

let apolloServer: ApolloServer<TestContext>;
const startTestServer = async (): Promise<void> => {
    const builtSchema = await buildTypeDefsAndResolvers({ resolvers, authChecker });
    const schema = makeExecutableSchema(builtSchema);
    apolloServer = new ApolloServer<TestContext>({ schema, context } as ApolloServerOptions<TestContext>);

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.MONGODB_URI());

        logger.info(`Connected to MongoDB in ${config.MODE} mode`);
        logger.info(`MongoDB URI is ${config.MONGODB_URI()}`);
    } catch (e) {
        logger.fatal("Cannot connect to MongoDB");
        if (e instanceof Error) logger.fatal(e.message);
    }
};

const testServer = (): ApolloServer<TestContext> => {
    return apolloServer;
};

const terminateTestServer = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongoose.connection.close();

        logger.warn("MongoDB database dropped");
    } catch (e) {
        logger.fatal("Failed to disconnect to MongoDB");
        if (e instanceof Error) logger.fatal(e.message);
    }
};

const resetDatabase = async () => {
    try {
        const collections = await mongoose.connection.db.collections();
        await Promise.all(collections.map((collection) => collection.deleteMany({})));
        logger.warn("DB successfully reset.");
    } catch (e) {
        logger.fatal("Cannot reset DB");
        if (e instanceof Error) logger.fatal(e.message);
    }
};

const addTestUser = async (testUser: User): Promise<User> => {
    const createdUser: DocumentType<User> = await UserModel.create(testUser as CreateUserInput);
    const returnedUser: User = await UserModel.findById(createdUser._id).lean();
    assert(returnedUser);
    return returnedUser;
};

const addTestCategory = async (name: string): Promise<Category> => {
    const createdCategory: DocumentType<Category> = await CategoryModel.create({ name } as CategoryInput);
    const returnedCategory: Category = await CategoryModel.findById(createdCategory._id).lean();
    assert(returnedCategory);
    return returnedCategory;
};

const addTestSubCategories = async (names: string[], parentCategory: string): Promise<SubCategory[]> => {
    const createdSubCategories: DocumentType<SubCategory>[] = await Promise.all(
        names.map((name) => SubCategoryModel.create({ name, parentCategory } as SubCategoryInput))
    );
    const returnedSubCategories: Array<SubCategory | null> = await Promise.all(
        createdSubCategories.map((subcategory) => SubCategoryModel.findById(subcategory._id).lean())
    );
    assert(returnedSubCategories);
    return returnedSubCategories as SubCategory[];
};

const addTestAccount = async (name: string, user: string): Promise<Account> => {
    const currency = "USD";
    const toCreate = { name, currency, user };
    const createdAccount: DocumentType<Account> = await AccountModel.create(toCreate);
    const returnedAccount: Account = await AccountModel.findById(createdAccount._id).lean();
    assert(returnedAccount);
    return returnedAccount;
};

export default {
    startTestServer,
    terminateTestServer,
    testServer,
    resetDatabase,
    addTestUser,
    addTestCategory,
    addTestSubCategories,
    addTestAccount,
};
