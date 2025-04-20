"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface DashboardData {
  totalValueLocked: number;
  volume: number;
  uniqueWallets: number;
  tvlChartData: {date: string; value: number}[];
  volumeChartData: {date: string; value: number}[];
  uniqueWaletsChartData: {date: string; value: number}[];
}

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalValueLocked: 0,
    volume: 0,
    uniqueWallets: 0,
    tvlChartData: [],
    volumeChartData: [],
    uniqueWalletsChartData: [],
  });

  useEffect(() => {
    // Fetch data from the backend API endpoint
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data: DashboardData = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Placeholder data for demonstration purposes (replace with real data)
  const totalValueLocked = 7429629;
  const tvlChartData = [
    {date: "Dec 22", value: 100000},
    {date: "Jan 5", value: 2000000},
    {date: "Jan 19", value: 2000000},
    {date: "Feb 2", value: 1000000},
    {date: "Feb 16", value: 4000000},
    {date: "Mar 2", value: 5000000},
    {date: "Apr 13", value: 7429629},
  ];

  const volume = 150000;
  const volumeChartData = [
    {date: "Dec 22", value: 10000},
    {date: "Jan 5", value: 20000},
    {date: "Jan 19", value: 15000},
    {date: "Feb 2", value: 12000},
    {date: "Feb 16", value: 30000},
    {date: "Mar 2", value: 25000},
    {date: "Apr 13", value: 150000},
  ];

  const uniqueWallets = 500;
  const uniqueWalletsChartData = [
    {date: "Dec 22", value: 10},
    {date: "Jan 5", value: 50},
    {date: "Jan 19", value: 45},
    {date: "Feb 2", value: 40},
    {date: "Feb 16", value: 100},
    {date: "Mar 2", value: 80},
    {date: "Apr 13", value: 500},
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-white text-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Total Value Dashboard</h1>

        <Card className="w-full mb-8 bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-black">Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-black">
              ${totalValueLocked}
            </CardDescription>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tvlChartData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row w-full justify-around">
          <Card className="w-full sm:w-1/2 mb-4 sm:mb-0 bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-black">
                {volume}
              </CardDescription>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={volumeChartData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date"/>
                  <YAxis/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full sm:w-1/2 bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">Unique Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-black">
                {uniqueWallets}
              </CardDescription>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={uniqueWalletsChartData}
                  margin={{top: 10, right: 30, left: 0, bottom: 0}}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date"/>
                  <YAxis/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="value" stroke="#ffc658" fill="#ffc658"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
