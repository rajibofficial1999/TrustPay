"use client";

import { getDashboardStats } from "@/actions/dashboard";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

interface DashboardStats {
  _id: string;
  name: string;
  logo: string;
  totalEarnings: number;
}

const DashboardPage = () => {
  const { data: dashboardStats, isPending } = useQuery<DashboardStats[]>({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  return (
    <Loader isLoading={isPending}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dashboardStats &&
          dashboardStats.map((stat) => (
            <div
              key={stat._id}
              className="border rounded-md p-4 shadow-md border-gray-100"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={stat.logo}
                  alt={stat.name}
                  width={40}
                  height={40}
                  className="border rounded-md p-0.5"
                />
                <h1 className="font-bold">{stat.name}</h1>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="italic">Total Earnings</p>
                <p className="italic text-sm">
                  $
                  <span className="font-semibold text-lg">
                    {stat.totalEarnings}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </Loader>
  );
};

export default DashboardPage;
