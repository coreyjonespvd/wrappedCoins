
import * as admin from 'firebase-admin';

async function seedAdminUser() {
  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });

    // Get the first user from Firebase Authentication
    const userRecords = await admin.auth().listUsers(1);
    const user = userRecords.users[0];

    if (!user) {
      console.log('No users found to make admin.');
      return;
    }

    // Set custom claim "role" to "admin" for the user
    await admin.auth().setCustomUserClaims(user.uid, {role: 'admin'});
    console.log(`Successfully set admin claim for user ${user.uid}`);
  } catch (error) {
    console.error('Error setting custom admin claim:', error);
  }
}

seedAdminUser();
