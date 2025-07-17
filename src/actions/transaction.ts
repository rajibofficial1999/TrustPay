import axiosInstance from "@/lib/axios";

export const createTransaction = async (fd: any) => {
  const { data: res } = await axiosInstance.post("/transactions", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const getTransactions = async () => {
  const { data: res } = await axiosInstance.get("/transactions");
  return res;
};

export const getTransaction = async (id: string) => {
  const { data: res } = await axiosInstance.get(`/transactions/${id}`);
  return res;
};

export const uploadScreenshot = async ({ id, fd }: any) => {
  const { data: res } = await axiosInstance.put(
    `/transactions/${id}/screenshots`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res;
};

export const updateTransactionStatus = async ({
  id,
  status,
}: {
  id: string;
  status: TransactionStatus;
}) => {
  const { data } = await axiosInstance.put(`/transactions/${id}/status`, {
    status,
  });
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data: res } = await axiosInstance.delete(`/transactions/${id}`);
  return res;
};
