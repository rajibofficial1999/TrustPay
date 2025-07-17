const appName = process.env.NEXT_PUBLIC_APP_NAME || "SigPay";

export const metadata = {
  title: `Register now - ${appName}`,
  description: "Register now for free.",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
