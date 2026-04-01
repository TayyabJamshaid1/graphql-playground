
  import express from "express"
  import { ApolloServer } from "@apollo/server";
  import { startStandaloneServer } from "@apollo/server/standalone";

import helmet from "helmet"
import { connectGraphQL } from "@/graphql/graphql.js"
import { expressMiddleware } from "@as-integrations/express5";
import cors from 'cors'
import { errorMiddleware } from "@/middlewares/error.js"
import morgan from "morgan"
import { createRedis } from "@/lib/redis.js";
import { rateLimiter } from "@/middlewares/rate-limiter.js";
import dotenv from "dotenv"
import { schema } from "./graphql/schema/schema";
import { ConnectToDatabase } from "./db";
import UserModel from "./models/user.model";
import { findAllUsers } from "./controllers/users";
import { findAllCourses, findAllLectures, findCourseById } from "./controllers/course";
  
  dotenv.config({path: './.env',});
  
  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port =Number( process.env.PORT) || 3000;
  ConnectToDatabase().then(()=>{
    console.log("Connected to MongoDB successfully");
  }).catch((err)=>{
    console.error("Failed to connect to MongoDB:", err);
  })

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Query: {
      users: findAllUsers,
      courses: findAllCourses,
      course: findCourseById, 
      lectures: findAllLectures,
    },
    Course: {
      instructor: async (parent) => {
        const user = await UserModel.findById(parent.instructor);
        return user;
      },
    },
  },
  
});
startStandaloneServer(server,{listen:{port}}).then(({url})=>{
  console.log(`Server is running at ${url}`)
}).catch((err)=>{
  console.error("Failed to start server:", err);
})