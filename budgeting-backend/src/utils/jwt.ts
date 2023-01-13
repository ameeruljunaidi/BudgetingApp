import jwt from "jsonwebtoken";
import config from "./config";

export function verifyJwt<T>(token: string): T | null {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as T;
        return decoded;
    } catch (e) {
        return null;
    }
}
