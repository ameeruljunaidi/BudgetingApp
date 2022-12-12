import { AuthChecker } from "type-graphql";
import Context from "../types/context";
import path from "path";
import pinoLogger from "../utils/logger";

const logger = pinoLogger(path.basename(__filename));

const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    if (!context.user) return false;
    if (roles) return roles.includes(context.user.role);
    else return true;
};

export default authChecker;
