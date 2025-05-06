"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { burnWpep } from "@/ai/flows/burn-wpep";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react'; // Import useWallet

const WithdrawPage = () => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [pepRecipient, setPepRecipient] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Solana Wallet state
    const { connected, publicKey } = useWallet(); // Get wallet state

    // State for total interactions and transactions connected to the backend
    const [totalInteractions, setTotalInteractions] = useState<number>(0);
    const [totalBurnedAmount, setTotalBurnedAmount] = useState<number>(0); // Sum of all burned wPEP

    // New State for transactions
    const [withdrawTransactions, setWithdrawTransactions] = useState<
        { id: string; type: string; amount: string }[]
    >([]);

    useEffect(() => {
        // TODO: Fetch total interactions from the backend
        fetchTotalInteractions().then(count => setTotalInteractions(count));

        // TODO: Fetch total burned amount from the backend
        fetchTotalBurnedAmount().then(amount => setTotalBurnedAmount(amount));

        // TODO: Fetch transactions data from the backend
        fetchTransactions().then(transactions => setWithdrawTransactions(transactions));
    }, []);

    useEffect(() => {
      if (connected && publicKey) {
        console.log("User's Solana wallet address:", publicKey.toBase58());
        // TODO: Fetch user's wPEP balance here
        // setSolBalance(fetchedBalance);
      }
    }, [connected, publicKey]);


    // Placeholder functions for backend interactions (Replace with your actual backend calls)
    async function fetchTotalInteractions(): Promise<number> {
        // TODO: Implement fetching total interactions from your backend (Firestore)
        return 1245; // Placeholder value
    }

    async function fetchTotalBurnedAmount(): Promise<number> {
        // TODO: Implement fetching total burned amount from your backend (Solana)
        return 7500; // Example: 7500 wPEP burned
    }

    async function fetchTransactions(): Promise<
        { id: string; type: string; amount: string }[]
    > {
        // TODO: Implement fetching transactions from your backend (Solana or Firestore)
        // This should return an array of transaction objects filtered for withdrawals
        return [
            { id: "#1245", type: "Withdrawal", amount: "0.000686" },
            { id: "#1243", type: "Withdrawal", amount: "0.000793" },
            { id: "#1242", type: "Withdrawal", amount: "0.000710" },
            { id: "#1241", type: "Withdrawal", amount: "0.000552" },
            { id: "#1240", type: "Withdrawal", amount: "0.259964" },
            { id: "#1239", type: "Withdrawal", amount: "0.000714" },
        ];
    }


    const handleWithdraw = async () => {
        if (!amount || !pepRecipient || !connected || !publicKey) {
            toast({
                title: "Error",
                description: "Please connect your Solana wallet, fill in all fields, and ensure you have enough wPEP.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
          // 1. TODO: Call a backend function (e.g., Cloud Function) to initiate the burn on Solana
          //    This function would create a Solana transaction to burn `amount` wPEP from the user's `publicKey`
          //    It might need the user to sign the transaction (or use delegated authority if set up).
          //    Example: const burnTxSignature = await initiateSolanaBurn(publicKey.toBase58(), amount);
          //    toast({ title: "Burning wPEP...", description: `Tx: ${burnTxSignature}` });

          // 2. Once the Solana burn is confirmed (wait for confirmation), call the AI/Lit flow
          const result = await burnWpep({ amount: amount, pepRecipient: pepRecipient }); // This flow should now trigger the PEP release via Lit

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message || "Withdrawal initiated successfully! PEP will be sent shortly.",
                });
                // Optionally update wPEP balance after successful burn
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
                description: error.message || "Something went wrong during withdrawal.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-screen bg-white text-black">
            {/* Withdrawal Section */}
            <div className="flex-1 p-6 flex flex-col bg-white">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-black">Withdrawal</h2>
                </div>

                {/* Burn Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-black">Amount of wPEP to Withdraw</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">wPEP</span>
                        {/* TODO: Display user's wPEP balance */}
                        <span className="text-black">Balance: N/A</span>
                    </div>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={amount ?? ''}
                        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full rounded-md mb-2 bg-gray-50 text-black"
                    />
                    {/* TODO: Add MAX button */}
                </div>

                {/* Receive Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-black">PEP Recipient Address</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">PEP</span>
                        <span className="text-black">~$0 USD</span>
                    </div>
                    <Input
                        id="pepRecipient"
                        type="text"
                        placeholder="Enter PEP address"
                        value={pepRecipient}
                        onChange={(e) => setPepRecipient(e.target.value)}
                        className="w-full rounded-md mb-2 bg-gray-50 text-black"
                    />
                </div>

                {/* Connect Wallet Section */}
                {!connected ? (
                     <WalletMultiButton className="w-full !bg-gray-200 !text-black hover:!bg-gray-300"/>
                 ) : (
                    <div className="w-full">
                       <div className="bg-gray-100 p-2 rounded mb-4">
                          <p className="text-sm text-black">Connected: <span className="font-mono">{publicKey?.toBase58()}</span></p>
                        </div>
                         <Button onClick={handleWithdraw} className="w-full" disabled={isLoading}>
                             {isLoading ? "Processing..." : "Withdraw wPEP"}
                         </Button>
                    </div>
                )}
            </div>
              {/* Transactions List */}
              <div className="w-full p-6 border-t border-border">
                  <h2 className="text-lg font-semibold mb-4 text-black">
                      <span className="mr-2">Total {totalInteractions} Interactions</span>
                      <span className="text-sm text-gray-500">({totalBurnedAmount} wPEP Burned)</span>
                  </h2>
                  <div className="overflow-y-auto max-h-48">
                      {withdrawTransactions.map((transaction, index) => (
                          <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-border last:border-none"
                          >
                              <span className="text-black">{transaction.id} {transaction.type}</span>
                              <span className="text-black">
                                  {transaction.amount} wPEP
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
        </div>
    );
};

export default WithdrawPage;
