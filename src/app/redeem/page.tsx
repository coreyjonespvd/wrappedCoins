"use client";

import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {burnWpep} from "@/ai/flows/burn-wpep";
import {Icons} from "@/components/icons";

const WithdrawPage = () => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [pepRecipient, setPepRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleWithdraw = async () => {
    if (!amount || !pepRecipient) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await burnWpep({amount: amount, pepRecipient: pepRecipient});
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Withdrawal initiated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to initiate withdrawal.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for connecting wallet
  const connectWallet = async () => {
    // TODO: Implement wallet connection logic here
    toast({
      title: "Wallet Connected",
      description: "Wallet connected successfully!",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white text-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">
          Withdrawal wPEP to PEP
        </h1>

        <div className="mt-6 w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-black" htmlFor="amount">
              Amount of wPEP to Withdraw:
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-black" htmlFor="pepRecipient">
              PEP Recipient Address:
            </label>
            <Input
              id="pepRecipient"
              type="text"
              placeholder="Enter PEP address"
              onChange={(e) => setPepRecipient(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 text-black"
            />
          </div>

              <Button onClick={connectWallet} className="w-full mb-4">
            <Icons.shield className="inline-block h-4 w-4 mr-2"/>
            Connect Solana Wallet
          </Button>

          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleWithdraw}
            disabled={isLoading}
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>
          Powered by Lit Protocol and Firebase
        </p>
      </footer>
    </div>
  );
};

export default WithdrawPage;
