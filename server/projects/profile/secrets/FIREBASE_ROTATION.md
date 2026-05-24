# Firebase Rotation

The previous local Firebase Admin key was removed from this workspace. Treat it as exposed.

Rotate it in Firebase or Google Cloud before the next production deploy:

1. Open Google Cloud IAM & Admin -> Service Accounts.
2. Select the Firebase Admin service account used by this backend.
3. Delete the old JSON key.
4. Create a new JSON key.
5. Save it locally as `server/projects/profile/secrets/firebase-service-account.json`.
6. Keep `FIREBASE_SERVICE_ACCOUNT_PATH=/run/secrets/firebase-service-account.json` in `server/.env.secrets` for Docker compose.

For the frontend Firebase web config, rotate or restrict the browser API key in Google Cloud Credentials, then update the ignored `frontend/keys/firebase.config.json`.
