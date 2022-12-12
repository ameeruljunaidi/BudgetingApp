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

export default {
    startTestServer,
    terminateTestServer,
    testServer,
    resetDatabase,
    addTestUser,
};
