"use client";

import {useState, useEffect} from "react";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {proveDeposit} from "@/ai/flows/prove-deposit";
import {Icons} from "@/components/icons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const DepositPage = () => {
  const [txid, setTxid] = useState<string>("");
  const [vout, setVout] = useState<number | undefined>(undefined);
  const [solRecipient, setSolRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  // State for wallet connection and balance
  const [isConnected, setIsConnected] = useState(false);
  const [pepBalance, setPepBalance] = useState<number | undefined>(undefined);

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

  // Placeholder function for connecting wallet
  const connectWallet = async () => {
    // TODO: Implement wallet connection logic here
    setIsConnected(true);
    setPepBalance(12345); // Example balance
    toast({
      title: "Wallet Connected",
      description: "Wallet connected successfully!",
    });
  };

  // Placeholder function for depositing PEP
  const depositPep = async (amount: number) => {
    // TODO: Implement PEP deposit logic here
    toast({
      title: "Deposit Initiated",
      description: `Depositing ${amount} PEP...`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-white text-black">
      {/* Transactions List */}
      <div className="w-full sm:w-1/3 p-6 border-r border-border">
        <h2 className="text-lg font-semibold mb-4 text-black">
          <span className="mr-2">Total {totalInteractions} Interactions</span>
          <span className="text-sm text-gray-500">({totalLockedAmount} PEP Locked)</span>
        </h2>
        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
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

      {/* Deposit Section */}
      <div className="flex-1 p-6 flex flex-col bg-white">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black">Deposit</h2>
        </div>

        {/* Lock Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Lock</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-black">PEP</span>
            <span className="text-black">~$0 USD</span>
          </div>
          <Input
            type="number"
            placeholder="0"
            className="w-full rounded-md mb-2 bg-gray-50 text-black"
          />
          <Button variant="outline" style={{color: 'black', backgroundColor: 'lightgrey'}} size="sm">
            Max
          </Button>
        </div>

        {/* Mint Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Mint</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-black">wPEP <Icons.shield className="inline-block h-4 w-4 ml-1"/> Custodial</span>
            <span className="text-black">~$0 USD</span>
          </div>
          <Input
            type="number"
            placeholder="0"
            className="w-full rounded-md mb-2 bg-gray-50 text-black"
          />
        </div>

        {/* Connect Wallet Section */}
        {!isConnected ? (
          <Button onClick={connectWallet} className="w-full">
            <Icons.shield className="inline-block h-4 w-4 mr-2"/>
            Connect PEP Wallet
          </Button>
        ) : (
          <div>
            <p className="text-black">Connected with {pepBalance} PEP</p>
            {/* Deposit Form */}
            <div className="mt-6 w-full max-w-md">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-black" htmlFor="depositAmount">
                  Deposit Amount:
                </label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="Enter amount to deposit"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 text-black"
                />
              </div>
              <Button onClick={() => depositPep(10)}>Deposit</Button>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default DepositPage;
