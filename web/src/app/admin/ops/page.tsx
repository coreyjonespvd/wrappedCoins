
// web/src/app/admin/ops/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '@/lib/firebase';
import { callOp } from '@/lib/useAdmin'; // Import the callOp function

const OpsPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [burnId, setBurnId] = useState("");
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

  const handleRotatePkp = async (type: string) => {
    try {
      const result = await callOp('rotatePkp', { type });
      if (result.success) {
        toast({
          title: "Rotate PKP",
          description: result.data.message || `Rotating PKP of type ${type}!`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to rotate PKP of type ${type}.`,
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

  const handleRetryRedemption = async () => {
    try {
      const result = await callOp('retryRedemption', { burnId });
      if (result.success) {
        toast({
          title: "Retry Redemption",
          description: result.data.message || `Retrying redemption for burn ID ${burnId}!`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to retry redemption for burn ID ${burnId}.`,
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

  const handleForceHeaderSync = async () => {
    // TODO: Implement forceHeaderSync function
    toast({
      title: "Force Header Sync",
      description: "Forcing header sync!",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-gray-50 text-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Operations Panel</h1>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Rotate PKP</CardTitle>
              <CardDescription>Mints new PKP and updates Firestore &amp; program PDA.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleRotatePkp("BTC")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Rotate PKP-BTC
              </Button>
              <Button onClick={() => handleRotatePkp("SOL")} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Rotate PKP-SOL
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Retry Redemption</CardTitle>
              <CardDescription>Reruns burn→PEP flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="text" placeholder="Burn ID" value={burnId} onChange={(e) => setBurnId(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 text-black" />
              <Button onClick={handleRetryRedemption} className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Retry Redemption
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Force Header Sync</CardTitle>
              <CardDescription>Forces header sync.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleForceHeaderSync} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Force Header Sync
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OpsPanel;
