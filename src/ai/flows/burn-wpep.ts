// Withdraw wPEP flow handles burning wPEP tokens and initiating the process to withdraw them for PEP.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const BurnWpepInputSchema = z.object({
  amount: z.number().describe('The amount of wPEP to burn.'),
  pepRecipient: z.string().describe('The Pepecoin address to receive the PEP.'),
});

export type BurnWpepInput = z.infer<typeof BurnWpepInputSchema>;

const BurnWpepOutputSchema = z.object({
  success: z.boolean().describe('Indicates if the burn was initiated successfully.'),
  burnEventId: z.string().describe('The ID of the burn event.').optional(),
  message: z.string().describe('A message describing the outcome of the burn initiation.'),
});

export type BurnWpepOutput = z.infer<typeof BurnWpepOutputSchema>;

export async function burnWpep(input: BurnWpepInput): Promise<BurnWpepOutput> {
  return burnWpepFlow(input);
}

const burnWpepPrompt = ai.definePrompt({
  name: 'burnWpepPrompt',
  input: {
    schema: z.object({
      amount: z.number().describe('The amount of wPEP to burn.'),
      pepRecipient: z.string().describe('The Pepecoin address to receive the PEP.'),
    }),
  },
  output: {
    schema: z.object({
      success: z.boolean().describe('Indicates if the burn was initiated successfully.'),
      burnEventId: z.string().describe('The ID of the burn event.').optional(),
      message: z.string().describe('A message describing the outcome of the burn initiation.'),
    }),
  },
  prompt: `You are assisting in a wPEP to PEP bridge.  The user wants to burn {{{amount}}} wPEP and receive PEP at address {{{pepRecipient}}}.  Indicate if the burn was initiated successfully. Return a burnEventId. Include a message describing the outcome of the burn initiation.`,
});

const burnWpepFlow = ai.defineFlow<
  typeof BurnWpepInputSchema,
  typeof BurnWpepOutputSchema
>({
  name: 'burnWpepFlow',
  inputSchema: BurnWpepInputSchema,
  outputSchema: BurnWpepOutputSchema,
},
async input => {
  const {output} = await burnWpepPrompt(input);
  // TODO: add database logging here
  return output!;
});

