"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { burnWpep } from "@/ai/flows/burn-wpep";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WithdrawPage = () => {
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [pepRecipient, setPepRecipient] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // State for wallet connection and balance
    const [isConnected, setIsConnected] = useState(false);
    const [solBalance, setSolBalance] = useState<number | undefined>(undefined);

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
        // This should return an array of transaction objects
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
            const result = await burnWpep({ amount: amount, pepRecipient: pepRecipient });
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
        setIsConnected(true);
        setSolBalance(54321); // Example balance
        toast({
            title: "Wallet Connected",
            description: "Wallet connected successfully!",
        });
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
                        <span className="text-black">~$0 USD</span>
                    </div>
                    <Input
                        type="number"
                        placeholder="0"
                        className="w-full rounded-md mb-2 bg-gray-50 text-black"
                    />
                </div>

                {/* Receive Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-black">PEP Recipient Address</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">PEP</span>
                        <span className="text-black">~$0 USD</span>
                    </div>
                    <Input
                        type="text"
                        placeholder="Enter PEP address"
                        onChange={(e) => setPepRecipient(e.target.value)}
                        className="w-full rounded-md mb-2 bg-gray-50 text-black"
                    />
                </div>

                {/* Connect Wallet Section */}
                {!isConnected ? (
                    <Button onClick={connectWallet} className="w-full">
                        <Icons.shield className="inline-block h-4 w-4 mr-2" />
                        Connect Solana Wallet
                    </Button>
                ) : (
                    <div>
                        <p className="text-black">Connected with {solBalance} wPEP</p>
                        {/* Withdrawal Form */}
                        <div className="mt-6 w-full max-w-md">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-black" htmlFor="amount">
                                    Withdraw Amount:
                                </label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount to withdraw"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 text-black"
                                />
                            </div>
                            <Button onClick={handleWithdraw}>Withdraw</Button>
                        </div>
                    </div>
                )}
            </div>
              {/* Transactions List */}
              <div className="w-full p-6 border-b border-border">
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
