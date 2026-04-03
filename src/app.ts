import dotenv from "dotenv";
import { ConnectToDatabase } from "./db";
import { connectGraphQL } from "./graphql/graphql";

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

 connectGraphQL(port)
