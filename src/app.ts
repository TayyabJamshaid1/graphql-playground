import dotenv from "dotenv";
import { ConnectToDatabase } from "./db";
import { connectGraphQL } from "./graphql/graphql";
import express, { Request, Response, NextFunction } from "express";
import { expressMiddleware } from "@as-integrations/express5";
import morgan from "morgan";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error";

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

let graphQLServer = connectGraphQL(port);
await graphQLServer.start();
const app = express();
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  let user = { role: "admin" };
  if (user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev")); //to see api fetch time in console and to tell about request type like get,post etc
app.use("/graphql", isAdmin, expressMiddleware(graphQLServer));
app.get("*path", (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
