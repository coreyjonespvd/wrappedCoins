
// web/src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '@/lib/firebase';
import { useSettings, saveSettings } from '@/lib/useAdmin';
import { Textarea } from "@/components/ui/textarea";

const SettingsForm = () => {
  const [user, setUser] = useState<any>(null);
  const { settings, isLoading, isError, mutate } = useSettings();
  const { toast } = useToast();
  const router = useRouter();

  const [localSettings, setLocalSettings] = useState(() => settings || {
    litApiKey: "",
    litAuthSig: "",
    solRpcUrl: "",
    electrumHosts: "[]",
    minConfirmations: 3,
    pepTxFee: 0.0001,
    reserveThreshold: 1000,
    alertEmail: "",
  });

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

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleInputChange = (tab: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  // Debounce save settings function
  const debouncedSaveSettings = useCallback(
    debounce(async (settingsToSave) => {
      const result = await saveSettings(settingsToSave);
      if (result.success) {
        toast({
          title: "Settings Saved",
          description: "Settings have been saved successfully!",
        });
        mutate(); // Refresh settings
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save settings.",
          variant: "destructive",
        });
      }
    }, 400),
    []
  );

  useEffect(() => {
    // Auto-save on changes with debounce
    if (settings && !isEqual(settings, localSettings)) {
      debouncedSaveSettings(localSettings);
    }
  }, [localSettings, settings, debouncedSaveSettings]);

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
                    <Input id="solRpcUrl" name="solRpcUrl" value={localSettings.solRpcUrl || ""} onChange={(e) => handleInputChange("network", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electrumHosts">Electrum Hosts (JSON Array)</Label>
                    <Textarea
                      id="electrumHosts"
                      name="electrumHosts"
                      value={localSettings.electrumHosts || "[]"}
                      onChange={(e) => handleInputChange("network", e)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minConfirmations">Min Confirmations</Label>
                    <Input type="number" id="minConfirmations" name="minConfirmations" value={localSettings.minConfirmations || 3} onChange={(e) => handleInputChange("network", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="lit" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="litApiKey">Lit API Key</Label>
                    <Input id="litApiKey" name="litApiKey" value={localSettings.litApiKey || ""} onChange={(e) => handleInputChange("lit", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="litAuthSig">Lit Auth Sig</Label>
                    <Input id="litAuthSig" name="litAuthSig" value={localSettings.litAuthSig || ""} onChange={(e) => handleInputChange("lit", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fees" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pepTxFee">PEP Transaction Fee</Label>
                    <Input type="number" id="pepTxFee" name="pepTxFee" value={localSettings.pepTxFee || 0.0001} onChange={(e) => handleInputChange("fees", e)} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="alerts" className="mt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reserveThreshold">Reserve Threshold</Label>
                    <Input type="number" id="reserveThreshold" name="reserveThreshold" value={localSettings.reserveThreshold || 1000} onChange={(e) => handleInputChange("alerts", e)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alertEmail">Alert Email</Label>
                    <Input id="alertEmail" name="alertEmail" value={localSettings.alertEmail || ""} onChange={(e) => handleInputChange("alerts", e)} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Utility function to debounce a function call
function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default SettingsForm;
