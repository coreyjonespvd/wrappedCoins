"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from '@/lib/firebase';
import { useSettings, callOp } from '@/lib/useAdmin';
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const { settings, isLoading, isError, mutate } = useSettings();
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

  const handleToggleMaintenance = async (checked: boolean) => {
    try {
      const result = await callOp('toggleMaintenance', { onOff: checked });
      if (result.success) {
        toast({
          title: "Maintenance Mode",
          description: result.data.message || `Maintenance mode is now ${checked ? 'ON' : 'OFF'}`,
        });
        mutate(); // Refresh settings
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to toggle maintenance mode.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (isError) {
    return <div>Error loading settings.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-white text-black">
      <div className="absolute top-4 right-4">
        <Button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign Out
        </Button>
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full mt-6">
          <Card className="bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">PEP Reserves</CardTitle>
              <CardDescription>Total PEP held in reserve</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-black">$1,000,000</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">wPEP Supply</CardTitle>
              <CardDescription>Total wPEP in circulation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-black">$500,000</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">Pending Burns</CardTitle>
              <CardDescription>Total wPEP waiting to be burned</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-black">$100,000</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 shadow-md rounded-lg p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-black">Header Height</CardTitle>
              <CardDescription>Current block height of the PEP chain</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-black">1,234,567</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex items-center space-x-2">
          <label htmlFor="maintenance" className="text-lg font-semibold text-black">Maintenance Mode:</label>
          <Toggle id="maintenance" onChecked={settings?.maintenanceMode || false} onCheckedChange={handleToggleMaintenance} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => router.push('/admin/settings')} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Settings
          </Button>
          <Button onClick={() => router.push('/admin/ops')} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Ops
          </Button>
          <Button onClick={() => router.push('/admin/logs')} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Logs
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
