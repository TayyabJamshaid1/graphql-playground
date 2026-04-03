import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { schema } from "./graphql/schema/schema";
import { ConnectToDatabase } from "./db";
import { resolverGraphql } from "./graphql/resolvers/resolver";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = Number(process.env.PORT) || 3000;
ConnectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolverGraphql,
});
startStandaloneServer(server, { listen: { port } })
  .then(({ url }) => {
    console.log(`Server is running at ${url}`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
