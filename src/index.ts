import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express, { json } from "express";
import http from "http";

import schema from "./graphql";

const PORT = 8000;

// Initialize the Express app
const app = express();

// Middlewares to the express app
app.use(cors());
app.use(json());

// Create a new Http server
const httpServer = http.createServer(app);

// Create Instance of Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startApp = async () => {
  try {
    await server.start();

    // Inject this apollo server instance as an express middleware
    app.use(
      `/graphql`,
      expressMiddleware(server, {
        context: async ({ req }) => ({}),
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: PORT }, resolve)
    );

    console.log(`Apollo Server Started on port ${PORT}`);
  } catch (err) {
    console.log(`Server not started`, err);
  }
};

export default startApp;
