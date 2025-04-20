
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface Settings {
  litApiKey: string;
  litAuthSig: string;
  solRpcUrl: string;
  electrumHosts: string; // Expecting a JSON string array
  minConfirmations: number;
  pepTxFee: number;
  maintenanceMode: boolean;
  reserveThreshold: number;
  alertEmail: string;
}

/**
 * Gets merged Firestore settings and secrets.
 */
export const getSettings = functions.https.onCall(async (data, context) => {
  // assertAdminRole(context);
  try {
    const settingsDoc = await admin.firestore().doc('settings/global').get();
    const settingsData = settingsDoc.data() as Settings;
    const secrets = await getSecrets();

    return {...settingsData, ...secrets};
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch settings.');
  }
});

/**
 * Sets settings, validates them, writes to Firestore, and updates Secrets.
 */
export const setSettings = functions.https.onCall(async (data, context) => {
  // assertAdminRole(context);

  try {
    // Validate payload
    validateSettings(data);

    // Persist non-sensitive settings to Firestore
    const {litApiKey, litAuthSig, ...firestoreData} = data;
    await admin.firestore().doc('settings/global').set(firestoreData, {merge: true});

    // Update secrets in Cloud Secret Manager
    await updateSecrets({litApiKey, litAuthSig});

    return {success: true, message: 'Settings updated successfully.'};
  } catch (error: any) {
    console.error('Error setting settings:', error);
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});

/**
 * Mints new PKP with Lit Action, updates Firestore & program PDA.
 */
export const rotatePkp = functions.https.onCall(async (data, context) => {
  // assertAdminRole(context);

  const {type} = data;
  // TODO: Mint new PKP with Lit Action
  // TODO: Update Firestore
  // TODO: Update program PDA
  console.log(`Rotating PKP of type: ${type}`);
  return {success: true, type, message: `Rotation of PKP type ${type} initiated.`};
});

/**
 * Reruns burn→PEP flow.
 */
export const retryRedemption = functions.https.onCall(async (data, context) => {
  // assertAdminRole(context);

  const {burnId} = data;
  // TODO: Rerun burn -> PEP flow
  console.log(`Retrying redemption for burn ID: ${burnId}`);
  return {success: true, burnId, message: `Redemption retry for burn ID ${burnId} initiated.`};
});

/**
 * Toggles maintenanceMode; Functions & UI respect flag.
 */
export const toggleMaintenance = functions.https.onCall(async (data, context) => {
  // assertAdminRole(context);

  const {onOff} = data;
  // TODO: Flip maintenanceMode
  await admin.firestore().doc('settings/global').update({maintenanceMode: onOff});
  return {success: true, onOff, message: `Maintenance mode is now ${onOff ? 'ON' : 'OFF'}.`};
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

/**
 * Validates the settings payload.
 */
function validateSettings(data: any) {
  if (!data) {
    throw new Error('Settings data is required.');
  }

  const {
    litApiKey,
    litAuthSig,
    solRpcUrl,
    electrumHosts,
    minConfirmations,
    pepTxFee,
    reserveThreshold,
    alertEmail,
  } = data;

  if (typeof litApiKey !== 'string' || litApiKey.trim() === '') {
    throw new Error('Lit API Key is required.');
  }

  if (typeof litAuthSig !== 'string' || litAuthSig.trim() === '') {
    throw new Error('Lit Auth Sig is required.');
  }

  if (typeof solRpcUrl !== 'string' || solRpcUrl.trim() === '') {
    throw new Error('Solana RPC URL is required.');
  }

  try {
    // Attempt to parse electrumHosts as a JSON array
    const hosts = JSON.parse(electrumHosts);
    if (!Array.isArray(hosts)) {
      throw new Error('Electrum Hosts must be a JSON array.');
    }
    // Add more checks for individual host strings if needed
  } catch (e: any) {
    throw new Error('Electrum Hosts must be a valid JSON array.');
  }

  if (typeof minConfirmations !== 'number' || minConfirmations < 0) {
    throw new Error('Min Confirmations must be a non-negative number.');
  }

  if (typeof pepTxFee !== 'number' || pepTxFee < 0) {
    throw new Error('PEP Tx Fee must be a non-negative number.');
  }

  if (typeof reserveThreshold !== 'number' || reserveThreshold < 0) {
    throw new Error('Reserve Threshold must be a non-negative number.');
  }

  if (typeof alertEmail !== 'string' || alertEmail.trim() === '') {
    throw new Error('Alert Email is required.');
  }
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(alertEmail)) {
    throw new Error('Alert Email must be a valid email address.');
  }
}
