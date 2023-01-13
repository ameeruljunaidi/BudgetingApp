import Context from "../types/context";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "./config";
import User, { UserModel } from "../schema/user.schema";
import { verifyJwt } from "./jwt";
import myLogger from "./logger";
import path from "path";

const logger = myLogger(path.basename(__filename));

const context = async (ctx: Context) => {
    const auth = ctx.req ? ctx.req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET) as JwtPayload;

        const user = await UserModel.findById(decodedToken._id);
        ctx.user = user;
        return ctx;
    }

    if (ctx.req.cookies.accessToken) {
        const token = ctx.req.cookies.accessToken;
        const decodedToken = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        const user = await UserModel.findById(decodedToken._id);
        ctx.user = user;
        return ctx;
    }
};

export default context;
