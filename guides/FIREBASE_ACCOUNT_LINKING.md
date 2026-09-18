# Firebase login methods and account linking

Google and email/password are available in the entry login dialog. Facebook
retains its disabled **Coming soon** button until its external setup is ready
and activation is explicitly requested. The account-linking implementation
supports Facebook, but does not activate that button. The Firebase project
must enable each provider being used and authorize the application domain.

An already linked Google or Facebook account signs in directly. With Firebase's
one-account-per-email setting, a provider collision can require one initial
confirmation using the existing login method:

1. Choose the new Google or Facebook login method.
2. If the dialog asks to link accounts, choose the method previously used for
   that same email address. For email/password, select **Login**, not **Create**.
3. Authenticate the existing account. MyScoutee links the pending provider
   credential through Firebase and refreshes the ID token before registering
   the application session.
4. Future sign-ins through either linked provider keep the same Firebase UID
   and existing MyScoutee profile.

A matching email alone does not bypass provider authentication. Selecting a
different email signs out that attempted Firebase session without linking it.
Incorrect passwords and duplicate email registrations remain errors. An
unverified password account must confirm its verification email before linking.
Conflicting existing application profile identities are rejected rather than
merged or deleted.

The pending OAuth credential stays only in memory, expires after five minutes,
and is cleared when the login dialog is closed, on logout, or when the Firebase
runtime changes. Closing the dialog is blocked while an authentication request
is running. Cancelling the provider popup allows a retry; refreshing the page
requires starting the linking flow again. No credential is written to logs,
URLs, application local storage, documentation or source control.

Reference: [Firebase account linking](https://firebase.google.com/docs/auth/web/account-linking).

## Verification boundary

The focused frontend suite covers direct sign-in, both social linking
directions, password confirmation, duplicate registration, wrong passwords,
wrong-email rejection, cancellation, expiry, unverified email and linking
failure. Component tests cover Google login requests, the disabled Facebook
button and login feedback. Backend tests verify that linked provider identities reuse the same
profile and that conflicting profiles are rejected.

After Facebook is configured and explicitly enabled, live Google/Facebook
consent, provider enablement and subsequent sign-in with
both real accounts must be checked in a normal user-controlled browser.
Automated SDK-mocked tests are not proof of those external provider settings.
