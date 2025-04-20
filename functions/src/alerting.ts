
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// TODO: Setup SendGrid and Cloud Messaging

/**
 * Sends email via SendGrid and Firestore notification on reserve imbalance.
 */
export const onReserveImbalance = functions.firestore
  .document('settings/global')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // TODO: Compare wPEP supply to PEP reserves + threshold
    // TODO: Send email via SendGrid
    // TODO: Push Cloud Messaging notification to admins

    console.log('Reserve imbalance detected', newValue, previousValue);
    return null;
  });

/**
 * Pushes Cloud Messaging notification to admins on failed Lit Action.
 */
export const onFailedLitAction = functions.logger.onLog(async (log) => {
  // TODO: Check if the log entry indicates a failed Lit Action
  // TODO: Push Cloud Messaging notification to admins

  console.log('Failed Lit Action detected', log);
  return null;
});
