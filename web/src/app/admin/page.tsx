
// web/src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from '@/lib/firebase';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/admin/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const handleToggleMaintenance = () => {
    // TODO: Call function to toggle maintenance mode
    setMaintenanceMode(!maintenanceMode);
    toast({
      title: "Maintenance Mode",
      description: `Maintenance mode is now ${!maintenanceMode ? 'ON' : 'OFF'}`,
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-gray-50 text-black">
      <div className="absolute top-4 right-4">
        <Button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign Out
        </Button>
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">PEP Reserves</CardTitle>
              <CardDescription>Total PEP held in reserve</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">$1,000,000</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">wPEP Supply</CardTitle>
              <CardDescription>Total wPEP in circulation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">$500,000</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Pending Burns</CardTitle>
              <CardDescription>Total wPEP waiting to be burned</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">$100,000</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Header Height</CardTitle>
              <CardDescription>Current block height of the PEP chain</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-black">1,234,567</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <label htmlFor="maintenance" className="text-lg font-semibold text-black">Maintenance Mode:</label>
            <Toggle id="maintenance" onChecked={maintenanceMode} onCheckedChange={handleToggleMaintenance} />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => router.push('/admin/settings')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Settings
          </Button>
          <Button onClick={() => router.push('/admin/ops')} className="ml-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Ops
          </Button>
          <Button onClick={() => router.push('/admin/logs')} className="ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Logs
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
