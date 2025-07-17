import ScrollContextProvider from "@/contexts/scroll-context";
import LoaderProvider from "./loader-provider";
import NextAuthProvider from "./next-auth-provider";
import ReactQueryProvider from "./react-query-provider";
import AuthContextProvider from "@/contexts/auth-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <NextAuthProvider>
        <LoaderProvider>
          <ScrollContextProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ScrollContextProvider>
        </LoaderProvider>
      </NextAuthProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
