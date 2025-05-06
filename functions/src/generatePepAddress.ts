import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ethers } from "ethers";

admin.initializeApp();

export const generatePepAddress = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const uid = context.auth.uid;
    const db = admin.firestore();

    try {
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `User document not found for uid: ${uid}`
        );
      }

      const userData = userDoc.data();
      if (!userData) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          `User document data not found for uid: ${uid}`
        );
      }

      const litPubKey = userData.pkpPublicKey;
      if (!litPubKey) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          `PKP public key not found for user: ${uid}`
        );
      }

      const compressedPublicKey = ethers.utils.computePublicKey(
        "0x" + litPubKey,
        true
      );
      const pepAddress = ethers.utils.getAddress(
        ethers.utils.keccak256(compressedPublicKey).slice(26)
      );
      await db.collection("users").doc(uid).set(
        {
          pepAddress: pepAddress,
        },
        { merge: true }
      );

      return { pepAddress };
    } catch (error) {
      console.error("Error generating PEP address:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error generating PEP address."
      );
    }
  }
);