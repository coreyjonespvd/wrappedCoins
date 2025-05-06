import * as LitJsSdk from "lit-js-sdk";
import axios from "axios";
import { accessControlConditions } from "./accessControl";

const client = new LitJsSdk.LitNodeClient({ debug: false });
const PEP_RPC_URL = "http://localhost:22555";

async function buildPepTx(sender: string, recipient: string, amount: number) {
  // Replace with actual PEP transaction building logic
  // This is a placeholder
  const rawTx = `PEP_TX_RAW_DATA_FROM_${sender}_TO_${recipient}_AMOUNT_${amount}`;
  return rawTx;
}

async function sendRawTransaction(signedHex: string) {
  try {
    const result = await axios.post(
      PEP_RPC_URL,
      {
        method: "sendrawtransaction",
        params: [signedHex],
        id: 1,
        jsonrpc: "1.0",
      },
      {
        auth: {
          username: "rpcuser",
          password: "rpcpass",
        },
      }
    );
    return result.data.result;
  } catch (error) {
    console.error("Error sending raw transaction:", error);
    return null;
  }
}

export async function handleWPEPBurn(
  userWallet: string,
  amount: number,
  pepDestinationAddress: string,
  pkpPublicKey: string,
  authSig: any
) {
  await client.connect();

  const toSign = await buildPepTx(userWallet, pepDestinationAddress, amount);
  const toSignBuffer = Buffer.from(toSign, "utf8");

  const sigShare = await client.executeJs({
    code: `
      const go = async () => {
        const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
        return sigShare;
      };

      go()
    `,
    accessControlConditions,
    authSig,
    jsParams: {
      recipient: pepDestinationAddress,
      amount,
      publicKey: pkpPublicKey,
      toSign: toSignBuffer,
      sigName: "sig1",
    },
  });

  return sigShare;
}

export { sendRawTransaction };