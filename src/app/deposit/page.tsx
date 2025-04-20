"use client";

import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {proveDeposit} from "@/ai/flows/prove-deposit";

const DepositPage = () => {
  const [txid, setTxid] = useState<string>("");
  const [vout, setVout] = useState<number | undefined>(undefined);
  const [solRecipient, setSolRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleDeposit = async () => {
    if (!txid || !vout || !solRecipient) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await proveDeposit({txid: txid, vout: vout, solRecipient: solRecipient});
      toast({
        title: "Success",
        description: `Deposit proved. Mint Transaction: ${result.mintTransaction}`,
      });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold">
          Deposit PEP to get wPEP
        </h1>

        <div className="mt-6 w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="txid">
              Transaction ID:
            </label>
            <Input
              id="txid"
              type="text"
              placeholder="Enter transaction ID"
              onChange={(e) => setTxid(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vout">
              Vout:
            </label>
            <Input
              id="vout"
              type="number"
              placeholder="Enter vout"
              onChange={(e) => setVout(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="solRecipient">
              Solana Recipient Address:
            </label>
            <Input
              id="solRecipient"
              type="text"
              placeholder="Enter Solana address"
              onChange={(e) => setSolRecipient(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading ? "Proving Deposit..." : "Prove Deposit"}
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

export default DepositPage;
