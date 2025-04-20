
// web/src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '@/lib/firebase';

const SettingsForm = () => {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    litApiKey: "",
    litAuthSig: "",
    solRpcUrl: "",
    electrumHosts: "",
    minConfirmations: 3,
    pepTxFee: 0.0001,
    maintenanceMode: false,
    reserveThreshold: 1000,
    alertEmail: "",
  });
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

  const handleInputChange = (tab: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    // TODO: Call setSettings function
    toast({
      title: "Settings Saved",
      description: "Settings have been saved successfully!",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-gray-50 text-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Settings</h1>

        <Card className="w-full bg-white shadow-md rounded-lg p-6">
          <CardContent>
            <Tabs defaultValue="network" className="w-full">
              <TabsList>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="lit">Lit</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="network" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="solRpcUrl">Solana RPC URL</Label>
                    <Input id="solRpcUrl" name="solRpcUrl" value={settings.solRpcUrl} onChange={(e) => handleInputChange("network", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electrumHosts">Electrum Hosts (JSON Array)</Label>
                    <Input id="electrumHosts" name="electrumHosts" value={settings.electrumHosts} onChange={(e) => handleInputChange("network", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minConfirmations">Min Confirmations</Label>
                    <Input type="number" id="minConfirmations" name="minConfirmations" value={settings.minConfirmations} onChange={(e) => handleInputChange("network", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="lit" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="litApiKey">Lit API Key</Label>
                    <Input id="litApiKey" name="litApiKey" value={settings.litApiKey} onChange={(e) => handleInputChange("lit", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="litAuthSig">Lit Auth Sig</Label>
                    <Input id="litAuthSig" name="litAuthSig" value={settings.litAuthSig} onChange={(e) => handleInputChange("lit", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fees" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pepTxFee">PEP Transaction Fee</Label>
                    <Input type="number" id="pepTxFee" name="pepTxFee" value={settings.pepTxFee} onChange={(e) => handleInputChange("fees", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="alerts" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reserveThreshold">Reserve Threshold</Label>
                    <Input type="number" id="reserveThreshold" name="reserveThreshold" value={settings.reserveThreshold} onChange={(e) => handleInputChange("alerts", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alertEmail">Alert Email</Label>
                    <Input id="alertEmail" name="alertEmail" value={settings.alertEmail} onChange={(e) => handleInputChange("alerts", e)} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button onClick={handleSaveSettings} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsForm;
