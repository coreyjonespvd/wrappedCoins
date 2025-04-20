
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/{id} {
      allow read, write: if request.auth.token.role == 'admin';
    }
    match /{document=**} {
      allow read: if true;
    }
  }
}
