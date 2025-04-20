
// web/src/app/admin/logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LogViewer = () => {
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
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

  useEffect(() => {
    // TODO: Implement live stream from Cloud Logging
    // Example: Use @google-cloud/logging to fetch logs
    // and update the logs state

    // Placeholder for demonstration purposes
    const placeholderLogs = [
      "Log entry 1: This is a test log.",
      "Log entry 2: Another test log entry.",
      "Log entry 3: A third test log entry.",
    ];
    setLogs(placeholderLogs);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-gray-50 text-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Log Viewer</h1>

        <Card className="w-full bg-white shadow-md rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-black">Cloud Logging Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm text-left text-black">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LogViewer;
