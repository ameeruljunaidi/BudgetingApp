import { GraphQLError } from "graphql";
import User, { UserModel } from "../schema/user.schema";
import Context from "../types/context";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import CreateUserInput from "../schema/user/createUser.input";
import LoginInput from "../schema/user/login.input";
import path from "path";

import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));

class UserService {
    static async getUserById(userId: string): Promise<User> {
        const user: User = await UserModel.findById(userId).lean();
        if (!user) throw new GraphQLError("Cannot find user in DB");
        return user;
    }

    async createUser(input: CreateUserInput): Promise<User> {
        const createdUser = new UserModel(input);

        try {
            return await createdUser.save();
        } catch (error) {
            let errorMessage = "Failed to add new user. ";
            logger.fatal(errorMessage);

            if (error instanceof Error) {
                logger.fatal(error.message);
                errorMessage += error.message;
            }

            throw new GraphQLError(errorMessage, {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
    }

    async login(input: LoginInput, _context: Context): Promise<string> {
        const errorMessage = "Invalid email or password";
        const user: User = await UserModel.findOne({ email: input.email }).lean();

        if (!user) {
            throw new GraphQLError(errorMessage, {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        logger.info("User found");
        const passwordIsValid = await bcrypt.compare(input.password, user.password);

        if (!passwordIsValid) {
            throw new GraphQLError(errorMessage, {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const token = jwt.sign(user, config.JWT_SECRET);
        logger.info("Password is valid, returning token.");
        return token;
    }

    async getUsers(): Promise<User[]> {
        return await UserModel.find({});
    }

    async deleteUser(context: Context): Promise<User> {
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
    }
}

export default UserService;
