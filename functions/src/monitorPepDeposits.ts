import axios from 'axios';
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

export async function checkPepDeposit(address: string) {
  try {
    const response = await axios.post(
      'http://localhost:22555',
      {
        method: 'getreceivedbyaddress',
        params: [address, 1],
        id: 1,
        jsonrpc: '1.0',
      },
      {
        auth: {
          username: 'rpcuser',
          password: 'rpcpass',
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error('Error checking PEP deposit:', error);
    return null;
  }
}

export async function mintWPEP(recipientWallet: string, amount: number) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const mint = new PublicKey('YOUR_WPEP_MINT_ADDRESS');
  const payer = Keypair.fromSecretKey(new Uint8Array(YOUR_SECRET_ARRAY));

  const recipientWalletPublicKey = new PublicKey(recipientWallet);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    recipientWalletPublicKey
  );

  const decimals = 9;
  const adjustedAmount = amount * (10 ** decimals)

  const signature = await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    adjustedAmount
  );

  console.log(`Minted wPEP to: ${recipientWallet}`);
}