"use client";

import PageLoader from "@/components/page-loader";
import { useEffect, useState } from "react";

const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);
  return <>{loading ? <PageLoader /> : children}</>;
};

export default LoaderProvider;
