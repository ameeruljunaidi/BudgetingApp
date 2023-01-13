import Context from "../types/context";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "./config";
import { UserModel } from "../schema/user.schema";
import myLogger from "./logger";
import path from "path";

const logger = myLogger(path.basename(__filename));

const context = async (ctx: Context) => {
    let context = ctx;
    const auth = context.req ? context.req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ") && process.env.NODE_ENV === "development") {
        const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET) as JwtPayload;

        const user = await UserModel.findById(decodedToken._id);
        context.user = user;
        return context;
    }

    if (context.req.cookies.accessToken) {
        const token = context.req.cookies.accessToken;
        const decodedToken = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        const user = await UserModel.findById(decodedToken._id);
        context.user = user;
        return context;
    }

    return context;
};

export default context;
