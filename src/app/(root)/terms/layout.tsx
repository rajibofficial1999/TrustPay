const appName = process.env.NEXT_PUBLIC_APP_NAME || "SigPay";

export const metadata = {
  title: `Terms and conditions - ${appName}`,
  description: "Our terms and conditions",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
