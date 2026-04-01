import UserModel from "@/models/user.model";

export const findAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

export const findById = async (id:string) => {
  const user = await UserModel.findById(id);
  return user;
};
