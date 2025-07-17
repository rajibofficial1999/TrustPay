import axiosInstance from "@/lib/axios";

export const createUser = async (email: string) => {
  const { data } = await axiosInstance.post("/users/create", { email });
  return data;
};
