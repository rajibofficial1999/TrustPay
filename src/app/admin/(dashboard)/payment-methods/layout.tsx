const appName = process.env.NEXT_PUBLIC_APP_NAME || "SigPay";

export const metadata = {
  title: `Payment methods - ${appName}`,
  description: "Manage payment methods",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
