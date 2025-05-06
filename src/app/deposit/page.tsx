"use client";

import {useState, useEffect} from "react";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {proveDeposit} from "@/ai/flows/prove-deposit";
import {Icons} from "@/components/icons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const DepositPage = () => {
  const [txid, setTxid] = useState<string>("");
  const [vout, setVout] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  // Solana Wallet state
  const { connected, publicKey } = useWallet();

  // State for total interactions and transactions connected to the backend
  const [totalInteractions, setTotalInteractions] = useState<number>(0);
  const [totalLockedAmount, setTotalLockedAmount] = useState<number>(0); // Sum of all locked PEP

  // New State for transactions
  const [depositTransactions, setDepositTransactions] = useState<
    {id: string; type: string; amount: string}[]
  >([]);

  useEffect(() => {
    // TODO: Fetch total interactions from the backend
    fetchTotalInteractions().then(count => setTotalInteractions(count));

    // TODO: Fetch total locked amount from the backend
    fetchTotalLockedAmount().then(amount => setTotalLockedAmount(amount));

    // TODO: Fetch transactions data from the backend
    fetchTransactions().then(transactions => setDepositTransactions(transactions));
  }, []);

   useEffect(() => {
    if (connected && publicKey) {
      console.log("User's wallet address:", publicKey.toBase58());
      // Optionally fetch wPEP balance or other relevant data here
    }
  }, [connected, publicKey]);

  // Placeholder functions for backend interactions (Replace with your actual backend calls)
  async function fetchTotalInteractions(): Promise<number> {
    // TODO: Implement fetching total interactions from your backend (Firestore)
    return 2143; // Placeholder value
  }

  async function fetchTotalLockedAmount(): Promise<number> {
    // TODO: Implement fetching total locked amount from your backend (Solana)
    return 15000; // Example: 15000 PEP locked
  }

  async function fetchTransactions(): Promise<
    {id: string; type: string; amount: string}[]
  > {
    // TODO: Implement fetching transactions from your backend (Solana or Firestore)
    // This should return an array of transaction objects
    return [
      {id: "#2143", type: "Deposit", amount: "0.000686"},
      {id: "#2142", type: "Withdrawal", amount: "0.020102"},
      {id: "#2141", type: "Deposit", amount: "0.000793"},
      {id: "#2140", type: "Deposit", amount: "0.000710"},
      {id: "#2139", type: "Deposit", amount: "0.000552"},
      {id: "#2138", type: "Deposit", amount: "0.259964"},
      {id: "#2137", type: "Deposit", amount: "0.000714"},
      {id: "#2136", type: "Withdrawal", amount: "0.000714"},
    ];
  }

  const handleDeposit = async () => {
    if (!txid || !vout || !publicKey) {
      toast({
        title: "Error",
        description: "Please connect your Solana wallet and fill in all deposit details.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pass the connected Solana wallet address as the recipient
      const solRecipient = publicKey.toBase58();
      const result = await proveDeposit({txid: txid, vout: vout, solRecipient: solRecipient});
      toast({
        title: "Success",
        description: `Deposit proved. Mint Transaction: ${result.mintTransaction}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong during deposit proof.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for depositing PEP (if direct wallet integration is added later)
  const depositPep = async (amount: number) => {
    // TODO: Implement PEP deposit logic here (e.g., show QR, interact with specific wallet)
    toast({
      title: "Deposit Initiated",
      description: `Please send ${amount} PEP to the deposit address.`, // Update message as needed
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Deposit Section */}
      <div className="flex-1 p-6 flex flex-col bg-white">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black">Deposit</h2>
        </div>

        {/* Lock Section (Manual Input - For now, users deposit externally) */}
        <div className="mb-6">
           <h3 className="text-lg font-semibold mb-2 text-black">Deposit PEP</h3>
          <p className="text-sm text-gray-600 mb-2">Send PEP to the designated address below. Once confirmed, enter the TXID and Vout to mint wPEP.</p>
          {/* TODO: Display the PKP-PEP deposit address here (fetched from Firestore/backend) */}
          <div className="bg-gray-100 p-2 rounded mb-2">
            <p className="text-sm font-mono break-all">PEP_DEPOSIT_ADDRESS_PLACEHOLDER</p>
          </div>
           <Input
            id="txid"
            type="text"
            placeholder="Enter PEP Transaction ID (TXID)"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            className="w-full rounded-md mb-2 bg-gray-50 text-black"
          />
          <Input
            id="vout"
            type="number"
            placeholder="Enter PEP Transaction Output Index (Vout)"
            value={vout ?? ''}
            onChange={(e) => setVout(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full rounded-md mb-2 bg-gray-50 text-black"
          />
        </div>


        {/* Mint Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Mint wPEP</h3>
           <p className="text-sm text-gray-600 mb-2">Connect your Solana wallet to receive the minted wPEP.</p>
           <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-black">wPEP <Icons.shield className="inline-block h-4 w-4 ml-1"/> Custodial</span>
            <span className="text-black">~$0 USD</span>
          </div>
          {/* Display connected wallet or connect button */}
           {!connected ? (
             <WalletMultiButton className="w-full !bg-gray-200 !text-black hover:!bg-gray-300"/>
           ) : (
             <div className="bg-gray-100 p-2 rounded mb-2">
                <p className="text-sm text-black">Connected: <span className="font-mono">{publicKey?.toBase58()}</span></p>
            </div>
           )}
        </div>

        {/* Action Button */}
        <Button onClick={handleDeposit} className="w-full" disabled={isLoading || !connected}>
          {isLoading ? 'Processing...' : 'Prove Deposit & Mint wPEP'}
        </Button>

        {/* Safety Message */}
        <Card className="mt-4 bg-destructive text-destructive-foreground">
          <CardHeader>
            <CardTitle>Important Safety Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              To keep your assets safe, avoid storing Ordinals / Inscriptions, and Runes in your Pepecoin wallet. Always verify transaction details before signing to protect your assets.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
           {/* Transactions List */}
           <div className="w-full p-6 border-t border-border">
        <h2 className="text-lg font-semibold mb-4 text-black">
          <span className="mr-2">Total {totalInteractions} Interactions</span>
          <span className="text-sm text-gray-500">({totalLockedAmount} PEP Locked)</span>
        </h2>
        <div className="overflow-y-auto max-h-48">
          {depositTransactions.map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-border last:border-none"
            >
              <span className="text-black">{transaction.id} {transaction.type}</span>
              <span className="text-black">
                {transaction.amount} PEP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
