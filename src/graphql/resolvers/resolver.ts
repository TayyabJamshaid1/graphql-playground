import {
  findAllCourses,
  findAllLectures,
  findCourseById,
  findUserCourses,
} from "@/controllers/course";
import { createNewUser, findAllUsers } from "@/controllers/users";
import UserModel from "@/models/user.model";

export const resolverGraphql = {
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
    instructor: async (parent: any) => {
      const user = await UserModel.findById(parent.instructor);
      return user;
    },
  },

  Lecture: {
    videoUrl: (parent: any) => {
      console.log(parent.videoUrl);

      return {
        _480p: parent.videoUrl._480p,
        _720p: parent.videoUrl._720p,
        _1080p: parent.videoUrl._1080p,
      };
    },
  },
};
