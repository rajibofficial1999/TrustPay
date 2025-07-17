const appName = process.env.NEXT_PUBLIC_APP_NAME || "SigPay";

export const metadata = {
  title: `Admin dashboard - ${appName}`,
  description: "Admin dashboard",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
