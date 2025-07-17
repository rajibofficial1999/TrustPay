import Image from "next/image";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link
          href="/admin"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="/images/logo_mobile.png"
            alt="logo"
            width={32}
            height={32}
          />
          Administration
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default layout;
