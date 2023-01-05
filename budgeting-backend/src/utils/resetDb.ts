import mongoose from "mongoose";
import config from "./config";
import path from "path";

import myLogger from "../utils/logger";

const logger = myLogger(path.basename(__filename));

(async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.MONGODB_URI());
        const collections = await mongoose.connection.db.collections();
        await Promise.all(collections.map((collection) => collection.deleteMany({})));

        logger.info("DB successfully reset.");
        process.exit(0);
    } catch (e) {
        logger.fatal("Cannot reset DB");
        if (e instanceof Error) logger.fatal(e.message);
    }
})();
