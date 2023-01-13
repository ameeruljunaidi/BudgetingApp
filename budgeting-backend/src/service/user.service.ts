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
import Account from "../schema/account.schema";
import CategoryGroups from "../schema/category.schema";

const logger = myLogger(path.basename(__filename));

// Get the lean version of user, error is thrown if user cannot be found
const getUserById = async (userId: string): Promise<User> => {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new GraphQLError("Cannot find user in DB");

    logger.info(user, "User retrieved from DB");

    return user as User;
};

const createUser = async (input: CreateUserInput): Promise<User> => {
    type UserToAdd = CreateUserInput & { categoryGroups: CategoryGroups[]; payees: string[] };
    const userToAdd: UserToAdd = {
        ...input,
        categoryGroups: [
            { categoryGroup: "Main Category Group", categories: ["Main Category"] },
            { categoryGroup: "Reconciler", categories: ["Reconciler"] },
        ],
        payees: ["Main Payee", "Reconciler"],
    };
    return UserModel.create({ ...userToAdd });
};

const login = async (input: LoginInput, context: Context): Promise<string> => {
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

    logger.info(token, "Token set");

    context.res.cookie("accessToken", token, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

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

    return returnedUpdatedUser;
};

const getAccountById = (user: User, accountId: string): Account => {
    const account = user.accounts.find((account) => account._id.toString() === accountId);
    if (!account) throw new GraphQLError("Cannot find account to reconcile.");
    return account;
};

const addCategoryGroup = async (categoryGroup: string, userId: string): Promise<CategoryGroups[]> => {
    const newCategoryGroup: CategoryGroups = { categoryGroup: categoryGroup, categories: [] };
    const user = await getUserById(userId);
    const newCategoryGroups: CategoryGroups[] = user.categoryGroups.concat(newCategoryGroup);
    await updateUser({ ...user, categoryGroups: newCategoryGroups });
    return newCategoryGroups;
};

const addCategory = async (categoryGroup: string, category: string, userId: string): Promise<CategoryGroups[]> => {
    const user = await getUserById(userId);

    const findGroup = user.categoryGroups.find((group) => group.categoryGroup === categoryGroup);
    if (!findGroup) throw new GraphQLError("Cannot find category group to add category to.");

    const updatedUser = {
        ...user,
        categoryGroups: user.categoryGroups.map((group) =>
            group.categoryGroup !== categoryGroup ? group : { ...group, categories: group.categories.concat(category) }
        ),
    };
    await updateUser(updatedUser);
    return updatedUser.categoryGroups;
};

const getUsersPaginated = getPagination<User>(UserModel);

export default {
    getUserById,
    createUser,
    login,
    getUsers,
    deleteUser,
    updateUser,
    getUsersPaginated,
    getAccountById,
    addCategoryGroup,
    addCategory,
};
