const appName = process.env.NEXT_PUBLIC_APP_NAME || "SigPay";

export const metadata = {
  title: `Manage payments - ${appName}`,
  description: "Manage all payments",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
