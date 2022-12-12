import { BaseContext } from "@apollo/server";
import User from "../../schema/user.schema";

interface TestContext extends BaseContext {
    user: User | null;
}

export default TestContext;
