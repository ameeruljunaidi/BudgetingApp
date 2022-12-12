import { ApolloServer, ApolloServerOptions } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildTypeDefsAndResolvers } from "type-graphql";

// import { execute, subscribe } from "graphql";
// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/lib/use/ws";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";

import Context from "./types/context";

import context from "./utils/context";
import config from "./utils/config";
import resolvers from "./resolvers";
import authChecker from "./utils/authChecker";
import path from "path";

import pinoLogger from "./utils/logger";

const logger = pinoLogger(path.basename(__filename));

(async () => {
    try {
        mongoose.set("strictQuery", false); // Remove for Mongoose 7 later

        await mongoose.connect(config.MONGODB_URI());
        logger.info(`Successfully connected to MongoDB in ${config.MODE} mode`);

        const app = express();
        const httpServer = http.createServer(app);
        const builtSchema = await buildTypeDefsAndResolvers({ resolvers, authChecker });
        const schema = makeExecutableSchema(builtSchema);
        const server = new ApolloServer<Context>({ schema, context } as ApolloServerOptions<Context>);

        await server.start();
        logger.info("Apollo server started");

        // @ts-ignore: server type unresolved issues, might be Apollo 4.0 issue, not sure
        app.use("/graphql", cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server, { context }));

        httpServer.listen(config.PORT, () => {
            logger.info(`Server is now running on http://localhost:${config.PORT}/graphql`);
        });
    } catch (error) {
        logger.fatal("Error connecting to budgeting-backend.");
        if (error instanceof Error) logger.fatal(error.message);
    }
})();
