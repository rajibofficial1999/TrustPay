import axiosInstance from "@/lib/axios";

export const fetchloggedInUser = async () => {
  const { data } = await axiosInstance.get("/auth/user");
  return data;
};
