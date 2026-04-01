import CourseModel from "@/models/course.model";
import LectureModel from "@/models/lecture.model";

export const findAllCourses = async () => {
  const courses = await CourseModel.find();
  return courses;
};

export const findCourseById = async (_: any, { id }: { id: string }) => {
  const course = await CourseModel.findById(id)
//   .populate("instructor");
  return course;
}
export const findAllLectures = async () => {
  try {
    const lectures = await LectureModel.find().sort({ order: 1 });
    return lectures;
  } catch (error) {
    console.error("Error finding lectures:", error);
    throw new Error("Failed to fetch lectures");
  }
};