import { BaseContext } from "@apollo/server";
import { Request, Response } from "express";
import User from "../schema/user.schema";

interface Context extends BaseContext {
    req: Request;
    res: Response;
    user: User | null;
}

export default Context;
