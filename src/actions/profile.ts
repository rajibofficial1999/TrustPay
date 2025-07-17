import axiosInstance from "@/lib/axios";

export const updateInfo = async ({ fullName }: { fullName: string }) => {
  const { data } = await axiosInstance.post("/profile", { fullName });
  return data;
};

export const updatePassword = async ({ password }: { password: string }) => {
  const { data } = await axiosInstance.post("/profile/set-password", {
    password,
  });
  return data;
};

export const deleteProfile = async () => {
  const { data } = await axiosInstance.delete("/profile");
  return data;
};
