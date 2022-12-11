import Context from "../types/context";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "./config";
import { UserModel } from "../schema/user.schema";

const context = async (ctx: Context) => {
    const auth = ctx.req ? ctx.req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET) as JwtPayload;

        const user = await UserModel.findById(decodedToken._id);
        ctx.user = user;

        return ctx;
    }
};

export default context;
