
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

    const wPEPSupply = 500000; // TODO: Replace with actual data
    const PEPReserves = 1000000; // TODO: Replace with actual data
    const threshold = newValue.reserveThreshold || previousValue.reserveThreshold || 1000; // Ensure threshold is defined

    // Compare wPEP supply to PEP reserves + threshold
    if (wPEPSupply > PEPReserves + threshold) {
      // TODO: Send email via SendGrid
      console.log('Sending email via SendGrid due to reserve imbalance');
      // TODO: Push Cloud Messaging notification to admins
      console.log('Pushing Cloud Messaging notification to admins');
    }

    console.log('Reserve imbalance detected', newValue, previousValue);
    return null;
  });

/**
 * Pushes Cloud Messaging notification to admins on failed Lit Action.
 */
export const onFailedLitAction = functions.logger.onLog(async (log) => {
  // TODO: Check if the log entry indicates a failed Lit Action
  if (log.severity === 'ERROR' && log.message?.includes('Lit Action failed')) {
    // TODO: Push Cloud Messaging notification to admins
    console.log('Pushing Cloud Messaging notification to admins due to failed Lit Action');
  }

  console.log('Failed Lit Action detected', log);
  return null;
});
