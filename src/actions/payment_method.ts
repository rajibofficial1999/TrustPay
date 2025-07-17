import axiosInstance from "@/lib/axios";

export const createPaymentMethod = async (fd: any) => {
  const { data: paymentMethod } = await axiosInstance.post(
    "/payment-methods",
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return paymentMethod;
};

export const getPaymentMethods = async () => {
  const { data } = await axiosInstance.get("/payment-methods");
  return data;
};

export const getPublicPaymentMethods = async () => {
  const { data } = await axiosInstance.get("/public/payment-methods");
  return data;
};

export const getPaymentMethod = async (id: string) => {
  const { data } = await axiosInstance.get(`/payment-methods/${id}`);
  return data;
};

export const updatePaymentMethod = async ({ id, fd }: any) => {
  const { data: paymentMethod } = await axiosInstance.put(
    `/payment-methods/${id}`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return paymentMethod;
};

export const deletePaymentMethod = async (id: string) => {
  const { data } = await axiosInstance.delete(`/payment-methods/${id}`);
  return data;
};
