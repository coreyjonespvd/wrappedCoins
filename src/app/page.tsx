"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {useRouter} from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2"
      style={{
        backgroundColor: 'rgba(220, 220, 220, 0.1)', // Light silver with transparency
        backdropFilter: 'blur(10px)', // Apply blur to the background
      }}
    >
      <Toaster/>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Welcome to Scrypt Bridge
        </h1>

        <div className="mt-6">
          <p className="text-xl sm:text-2xl">
            Bridge your Scrypt coins to Solana
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Deposit</CardTitle>
              <CardDescription>Bridge your PEP to Solana as wPEP</CardDescription>
            </CardHeader>
            <CardContent>
              <Button style={{backgroundColor: 'lightgrey', color: 'black'}} onClick={() => router.push('/deposit')}>Go to Deposit</Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full sm:w-auto mt-4">
            <CardHeader>
              <CardTitle className="text-black">Withdraw</CardTitle>
              <CardDescription>Bridge your wPEP back to PEP</CardDescription>
            </CardHeader>
            <CardContent>
              <Button  style={{backgroundColor: 'lightgrey', color: 'black'}} onClick={() => router.push('/withdraw')}>Go to Withdraw</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <Button onClick={() => router.push('/dashboard')} className="absolute left-4 bottom-4">Total Value Dashboard</Button>
                <Button onClick={() => router.push('/admin')} className="absolute left-4 bottom-4 ml-40">Admin Panel</Button>
      </footer>
    </div>
  );
}

