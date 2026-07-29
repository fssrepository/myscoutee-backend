# Firebase Rotation

The previous local Firebase Admin key was removed from this workspace. Treat it as exposed.

Rotate it in Firebase or Google Cloud before the next production deploy:

1. Open Google Cloud IAM & Admin -> Service Accounts.
2. Select the Firebase Admin service account used by this backend.
3. Delete the old JSON key.
4. Create a new JSON key.
5. Sign in through the local Operator bootstrap account.
6. Save the replacement service-account JSON through the protected deployment
   configuration page, run both Firebase capability tests, and explicitly
   activate the tested revision.

For the Firebase browser configuration, rotate or restrict the browser API key
in Google Cloud Credentials, then update the public browser fields through the
same Operator deployment configuration flow. The frontend does not load or
package `frontend/keys/firebase.config.json`.

The legacy file-backed startup variables remain available for existing
deployments, but Operator-managed activation stores the credentials encrypted
in MongoDB and does not require a packaged service-account file.
