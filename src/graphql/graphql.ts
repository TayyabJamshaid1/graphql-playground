
import { helloResolver } from "@/graphql/resolvers/hello.js";
import { ApolloServer } from "@apollo/server";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";
import { schema } from "./schema/schema";
import { resolverGraphql } from "./resolvers/resolver";
import { startStandaloneServer } from "@apollo/server/standalone";

export const connectGraphQL = (port: number) => {
 
 const server = new ApolloServer({
   typeDefs: schema,
   resolvers: resolverGraphql,
 });
// startStandaloneServer(server, { listen: { port } })
//   .then(({ url }) => {
//     console.log(`Server is running at ${url}`);
//   })
//   .catch((err) => {
//     console.error("Failed to start server:", err);
//   });

  return server;
};

//appolo server data example
// query ExampleQuery{
// #  users {
// #   email
// #   courses {
// #     instructor {
// #       email
// #     }
// #   }
// #  }
//  users {
//   name
//   email
//  }
// }

// # mutation MyMutation($name: String!, $password: String!, $email: String!, $googleId: String!, $role: String!, $avatar: String!, $verified: Boolean!){
// #   createNewUser(name: $name, password: $password, email: $email, googleId: $googleId, role: $role, avatar: $avatar, verified: $verified) {
// #     _id
// #     name
// #     email
// #     role
// #     verified
// #     avatar
// #     createdAt
// #     updatedAt
// #   }
// # }

