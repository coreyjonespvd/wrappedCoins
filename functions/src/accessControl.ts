import * as LitJsSdk from "lit-js-sdk";
import * as admin from "firebase-admin";

const client = new LitJsSdk.LitNodeClient({ debug: false });

export const accessControlConditions = [
  {
    method: "balanceOf",
    chain: "solana",
    standardContractType: "SPL",
    contractAddress: "YOUR_WPEP_MINT_ADDRESS",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">=",
      value: "1",
    },
  },
];

export async function saveSigningCondition(authSig: any) {
  await client.connect();
  const chain = "solana";
  const resourceId = {
    baseUrl: "wrapped-pep",
    path: "/unwrap",
    orgId: "",
    role: "",
    extraData: "unwrap-pep-access",
  };

  const { signatures, response } =
    await client.saveSigningCondition({
      accessControlConditions,
      chain,
      authSig,
      resourceId,
    });

  return {signatures, response};
}