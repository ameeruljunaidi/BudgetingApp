import { GraphQLError } from "graphql";
import User, { UserModel } from "../schema/user.schema";
import Context from "../types/context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import CreateUserInput from "../schema/user/createUser.input";
import LoginInput from "../schema/user/login.input";
import path from "path";

import myLogger from "../utils/logger";
import getPagination from "./pagination.service";

const logger = myLogger(path.basename(__filename));

export const getUserById = async (userId: string): Promise<User> => {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new GraphQLError("Cannot find user in DB");

    logger.info(user, "User retrieved from DB");

    return user as User;
};

const createUser = async (input: CreateUserInput): Promise<User> => {
    const category = { categoryGroup: "Main Category Group", category: "Main Category" };
    return UserModel.create({ ...input, categories: [category] });
};

const login = async (input: LoginInput, _context: Context): Promise<string> => {
    const user: User = await UserModel.findOne({ email: input.email }).lean();

    if (!user) {
        const userNotFound = "Please sign up.";

        throw new GraphQLError(userNotFound, {
            extensions: { code: "BAD_USER_INPUT" },
        });
    }

    logger.info({ user }, "User found");
    logger.info({ input: input.password }, "Input password");
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
        const wrongCredentials = "Wrong email or password. Please try again.";

        throw new GraphQLError(wrongCredentials, {
            extensions: { code: "BAD_USER_INPUT" },
        });
    }

    const token = jwt.sign(user, config.JWT_SECRET);
    logger.info("Password is valid, returning token.");
    return token;
};

const getUsers = async (): Promise<User[]> => {
    return UserModel.find({});
};

const deleteUser = async (context: Context): Promise<User> => {
    const userId = context.user?._id;

    let errorMessage = "Cannot find user id.";

    if (!userId) {
        throw new GraphQLError(errorMessage, {
            extensions: { code: "UNAUTHENTICATED" },
        });
    }

    errorMessage = "Error with Mongoose";

    const returnedUser = await UserModel.findByIdAndDelete(userId);
    if (!returnedUser) {
        throw new GraphQLError(errorMessage, {
            extensions: { code: "UNAUTHENTICATED" },
        });
    }

    return returnedUser;
};

const updateUser = async (updatedUser: User): Promise<User> => {
    const returnedUpdatedUser = await UserModel.findByIdAndUpdate(updatedUser._id, updatedUser, { new: true });
    if (!returnedUpdatedUser) throw new GraphQLError("Error updating user to the DB");

    logger.info(returnedUpdatedUser, "Returned updated user from db is:");

    return returnedUpdatedUser;
};

const getUsersPaginated = getPagination<User>(UserModel);

export default { getUserById, createUser, login, getUsers, deleteUser, updateUser, getUsersPaginated };
