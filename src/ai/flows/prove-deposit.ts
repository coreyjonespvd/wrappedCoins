// 'use server';

/**
 * @fileOverview Flow for proving a PEP deposit and minting wPEP on Solana.
 *
 * - proveDeposit - A function that handles the deposit proving process.
 * - ProveDepositInput - The input type for the proveDeposit function.
 * - ProveDepositOutput - The return type for the proveDeposit function.
 */

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getLatestPepHeader} from '@/services/electrumx';

const ProveDepositInputSchema = z.object({
  txid: z.string().describe('The transaction ID of the PEP deposit.'),
  vout: z.number().describe('The output index of the PEP deposit transaction.'),
  solRecipient: z.string().describe('The Solana address to receive the wPEP.'),
});
export type ProveDepositInput = z.infer<typeof ProveDepositInputSchema>;

const ProveDepositOutputSchema = z.object({
  mintTransaction: z.string().describe('The Solana transaction ID of the wPEP mint.'),
});
export type ProveDepositOutput = z.infer<typeof ProveDepositOutputSchema>;

export async function proveDeposit(input: ProveDepositInput): Promise<ProveDepositOutput> {
  return proveDepositFlow(input);
}

const proveDepositPrompt = ai.definePrompt({
  name: 'proveDepositPrompt',
  input: {
    schema: z.object({
      txid: z.string().describe('The transaction ID of the PEP deposit.'),
      vout: z.number().describe('The output index of the PEP deposit transaction.'),
      solRecipient: z.string().describe('The Solana address to receive the wPEP.'),
      latestPepHeader: z.object({
        blockHash: z.string(),
        blockHeight: z.number(),
        totalWork: z.number(),
      }).describe('Latest Pepecoin block header from ElectrumX'),
    }),
  },
  output: {
    schema: z.object({
      mintTransaction: z.string().describe('The Solana transaction ID of the wPEP mint.'),
    }),
  },
  prompt: `You are assisting in a cross-chain bridge from Pepecoin (PEP) to Solana.

The user has deposited PEP in transaction {{txid}}, output index {{vout}} and wants to receive wPEP on Solana address {{solRecipient}}.

The latest Pepecoin block header is:
BlockHash: {{latestPepHeader.blockHash}}
BlockHeight: {{latestPepHeader.blockHeight}}
TotalWork: {{latestPepHeader.totalWork}}

Create a Solana transaction to mint wPEP to the specified Solana address. Return the signed transaction ID.
`,
});

const proveDepositFlow = ai.defineFlow<
  typeof ProveDepositInputSchema,
  typeof ProveDepositOutputSchema
>(
  {
    name: 'proveDepositFlow',
    inputSchema: ProveDepositInputSchema,
    outputSchema: ProveDepositOutputSchema,
  },
  async input => {
    // Fetch the latest PepHeader to include in the prompt
    const latestPepHeader = await getLatestPepHeader();

    const {output} = await proveDepositPrompt({
      ...input,
      latestPepHeader,
    });
    // TODO: Implement Merkle proof verification against stored headers
    // TODO: Implement depositProof PDA creation to prevent replays
    // TODO: Trigger Lit Action pepToSolMint.js to sign Solana transaction
    // TODO: Implement Cloud Function broadcastMint to push the signed transaction

    return output!;
  }
);
