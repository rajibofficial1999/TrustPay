import axiosInstance from "@/lib/axios";

export const createPayment = async (fd: any) => {
  const { data: res } = await axiosInstance.post("/payments", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const getPayments = async () => {
  const { data: res } = await axiosInstance.get("/payments");
  return res;
};

export const getPayment = async (id: string) => {
  const { data: res } = await axiosInstance.get(`/payments/${id}`);
  return res;
};

export const uploadScreenshot = async ({ id, fd }: any) => {
  const { data: res } = await axiosInstance.put(
    `/payments/${id}/screenshots`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res;
};

export const updatePaymentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: PaymentStatus;
}) => {
  const { data } = await axiosInstance.put(`/payments/${id}/status`, {
    status,
  });
  return data;
};

export const deletePayment = async (id: string) => {
  const { data: res } = await axiosInstance.delete(`/payments/${id}`);
  return res;
};
