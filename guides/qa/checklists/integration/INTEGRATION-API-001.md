# INTEGRATION-API-001 — API resources and callback

This checkpoint proves the assembled development stack through nginx. It uses
one key generated through the normal Casey profile UI; no integration token is
seeded or written directly to MongoDB.

## Actors

- Casey Bridge: API key and resource owner.
- Nova Social: ordinary participant who triggers the callback with Join.

## Flow

1. Launch the two managed sessions with the versioned
   `INTEGRATION-API-001` browser configuration.
2. In Casey's Profile, open API integration, generate one expiring test key,
   and copy the one-time secret. Confirm the key appears in the list.
3. Configure a fresh MyScoutee Java client identity with the displayed public
   base URL and that key. `connect` must succeed through nginx.
4. Register one callback for `event.changed` and `asset.changed`.
5. Through the client, POST one image-bearing Asset and one image-bearing
   public Event. Both results must preserve the caller UUID as `id` and return
   a MyScoutee UUID as `externalId`.
6. In Casey's UI, confirm the Asset and Event are shown once under Casey's
   managed/owned data with the submitted required fields and image.
7. In Nova's UI, open the public Event and perform the normal Join action.
8. Confirm the callback receiver gets `event.changed` for the same caller
   `id` and MyScoutee `externalId`, with participant change status and only the
   documented minimal participant projection.
9. Disable watch through `POST /watch`, revoke the generated key through
   Casey's UI, and confirm a later `connect` with it returns HTTP 401.

## Pass boundary

PASS requires the UI ownership/presentation checks, the persisted id mapping,
the real Join mutation and the delivered callback. API-only creation without
the two UI views is not sufficient.
