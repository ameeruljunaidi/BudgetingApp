import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();

const MODE = process.env.NODE_ENV;

const PORT = process.env.PORT;

const MONGODB_URI = (): string => {
    switch (process.env.NODE_ENV) {
        case "test":
            if (process.env.TEST_MONGODB_URI) return process.env.TEST_MONGODB_URI;
            throw new Error("Cannot find MongoDB URI");
        case "development":
            if (process.env.DEV_MONGODB_URI) return process.env.DEV_MONGODB_URI;
            throw new Error("Cannot find MongoDB URI");
        case "production":
            if (process.env.PROD_MONGODB_URI) return process.env.PROD_MONGODB_URI;
            throw new Error("Cannot find MongoDB URI");
        default:
            throw new Error("Cannot find MongoDB URI");
    }
};

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

export default { MONGODB_URI, PORT, JWT_SECRET, MODE };
