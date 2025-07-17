import axiosInstance from "@/lib/axios";

export const getDashboardStats = async () => {
  const { data } = await axiosInstance.get("/dashboard/stats");
  return data;
};
