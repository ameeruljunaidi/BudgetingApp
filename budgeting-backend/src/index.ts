import { ApolloServer, ApolloServerOptions } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildTypeDefsAndResolvers } from "type-graphql";

// import { execute, subscribe } from "graphql";
// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import Context from "./types/context";

import context from "./utils/context";
import config from "./utils/config";
import resolvers from "./resolvers";
import authChecker from "./utils/authChecker";
import path from "path";

import myLogger from "./utils/logger";

const logger = myLogger(path.basename(__filename));

(async () => {
    try {
        mongoose.set("strictQuery", false); // Remove for Mongoose 7 later

        await mongoose.connect(config.MONGODB_URI(), { autoIndex: true });
        await mongoose.connection.syncIndexes(); // fixed unique not working: https://dev.to/akshatsinghania/mongoose-unique-not-working-16bf
        logger.info(`Successfully connected to MongoDB in ${config.MODE} mode`);

        const app = express();

        const corsOptions = {
            origin: "http://localhost:3000",
            credentials: true,
        };

        const httpServer = http.createServer(app);
        const builtSchema = await buildTypeDefsAndResolvers({ resolvers, authChecker });
        const schema = makeExecutableSchema(builtSchema);
        const server = new ApolloServer<Context>({
            schema,
            context,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        } as ApolloServerOptions<Context>);

        await server.start();
        logger.info("Apollo server started");

        app.use(cookieParser());

        // prettier-ignore
        // @ts-ignore: server type unresolved issues, might be Apollo 4.0 issue, not sure
        app.use("/graphql", cors<cors.CorsRequest>(corsOptions), bodyParser.json(), expressMiddleware(server, { context }));

        httpServer.listen(config.PORT, () => {
            logger.info(`Server is now running on http://localhost:${config.PORT}/graphql`);
        });
    } catch (error) {
        logger.fatal("Error connecting to budgeting-backend.");
        if (error instanceof Error) logger.fatal(error.message);
    }
})();
