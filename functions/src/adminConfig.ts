
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// TODO: Add interfaces for settings and secrets

/**
 * Gets merged Firestore settings and secrets.
 */
export const getSettings = functions.https.onCall(async (data, context) => {
  assertAdminRole(context);
  // TODO: Fetch settings from Firestore
  const settings = await admin.firestore().doc('settings/global').get();
  // TODO: Fetch secrets from Cloud Secret Manager
  const secrets = await getSecrets();

  return {...settings.data(), ...secrets};
});

/**
 * Sets settings, validates them, writes to Firestore, and updates Secrets.
 */
export const setSettings = functions.https.onCall(async (data, context) => {
  assertAdminRole(context);

  // TODO: Validate payload
  // TODO: Write to Firestore
  await admin.firestore().doc('settings/global').set(data);
  // TODO: Update secrets in Cloud Secret Manager
  await updateSecrets(data);
  return {success: true};
});

/**
 * Mints new PKP with Lit Action, updates Firestore & program PDA.
 */
export const rotatePkp = functions.https.onCall(async (data, context) => {
  assertAdminRole(context);

  const {type} = data;
  // TODO: Mint new PKP with Lit Action
  // TODO: Update Firestore
  // TODO: Update program PDA
  return {success: true, type};
});

/**
 * Reruns burn→PEP flow.
 */
export const retryRedemption = functions.https.onCall(async (data, context) => {
  assertAdminRole(context);

  const {burnId} = data;
  // TODO: Rerun burn -> PEP flow
  return {success: true, burnId};
});

/**
 * Toggles maintenanceMode; Functions & UI respect flag.
 */
export const toggleMaintenance = functions.https.onCall(async (data, context) => {
  assertAdminRole(context);

  const {onOff} = data;
  // TODO: Flip maintenanceMode
  await admin.firestore().doc('settings/global').update({maintenanceMode: onOff});
  return {success: true, onOff};
});

/**
 * Retrieves sensitive values from Google Cloud Secret Manager.
 */
async function getSecrets() {
  // TODO: Implement this to fetch secrets from Google Cloud Secret Manager.
  return {litApiKey: 'test', litAuthSig: 'test'};
}

/**
 * Updates sensitive values in Google Cloud Secret Manager.
 */
async function updateSecrets(data: any) {
  // TODO: Implement this to update secrets in Google Cloud Secret Manager.
  console.log('Secrets updated:', data);
}

/**
 * Asserts that the user has the 'admin' role.
 */
function assertAdminRole(context: functions.https.CallableContext) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Missing authentication');
  }

  if (context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }
}
