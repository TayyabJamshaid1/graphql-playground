import UserModel from "@/models/user.model";

export const findAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

export const findById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user;
};
export const createNewUser = async (
  _: any,
  {
    name,
    password,
    email,
    googleId,
    role,
    avatar,
    verified,
  }: {
    name: string;
    password: string;
    email: string;
    googleId: string;
    role: string;
    avatar: string;
    verified: boolean;
  },
) => {
  const users = await UserModel.create({
    name,
    password,
    email,
    googleId,
    role,
    avatar,
    verified,
  });
  console.log(users, "data from createNewUser controller");

  return users;
};
