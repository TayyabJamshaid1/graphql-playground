import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { schema } from "./graphql/schema/schema";
import { ConnectToDatabase } from "./db";
import UserModel from "./models/user.model";
import { createNewUser, findAllUsers } from "./controllers/users";
import {
  findAllCourses,
  findAllLectures,
  findCourseById,
  findUserCourses,
} from "./controllers/course";

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
  resolvers: {
    Mutation: {
      createNewUser: createNewUser,
    },
    Query: {
      users: findAllUsers,
      courses: findAllCourses,
      course: findCourseById,
      lectures: findAllLectures,
    },
    User: {
      courses: findUserCourses,
    },
    Course: {
      instructor: async (parent) => {
        const user = await UserModel.findById(parent.instructor);
        return user;
      },
    },

    Lecture: {
      videoUrl: (parent) => {
        console.log(parent.videoUrl);

        return {
          _480p: parent.videoUrl._480p,
          _720p: parent.videoUrl._720p,
          _1080p: parent.videoUrl._1080p,
        };
      },
    },
  },
});
startStandaloneServer(server, { listen: { port } })
  .then(({ url }) => {
    console.log(`Server is running at ${url}`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
