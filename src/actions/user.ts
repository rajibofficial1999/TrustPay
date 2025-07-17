import axiosInstance from "@/lib/axios";

export const getUsers = async () => {
  const { data } = await axiosInstance.get("/users");
  return data;
};

export const createUser = async (email: string) => {
  const { data } = await axiosInstance.post("/users/create", { email });
  return data;
};

export const createAdminUser = async (data: UserCreateFormData) => {
  const { data: res } = await axiosInstance.post("/users", data);
  return res;
};

export const getUser = async (id: string) => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UserUpdateFormData;
}) => {
  const { data: res } = await axiosInstance.put(`/users/${id}`, data);
  return res;
};

export const deleteUser = async (id: string) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data;
};
