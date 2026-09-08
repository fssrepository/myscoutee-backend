# Frontend adjacent HTTP read/write audit

Status: inventory complete; remediation pending
Last updated: 2026-09-08
Repository snapshot: parent `8f23dc8f`, frontend `59eb5427`

Scope: all 564 non-test TypeScript files under `frontend/src`. Only operations
which can issue an HTTP read immediately followed by an HTTP write are listed.
Cache-only reads, single HTTP writes, local datasource internals and general
service cleanup are out of scope.

## Confirmed direct pairs

| ID | Location | Consecutive calls | Notes |
| --- | --- | --- | --- |
| `HTTP-RW-01` | `frontend/src/app/asset/components/asset-popup/asset-popup.component.ts:781` | `loadOwnedAssetDetailById` at 827, then `saveOwnedAsset` at 831 | Accept/remove one asset request. The request list is already derived from the store before the detail GET. This is the closest remaining copy of the original problem. |
| `HTTP-RW-02` | `frontend/src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts:1126` | `loadOwnedAssetDetailById` at 1130, then `saveOwnedAsset` at 1162 | Accept/remove one availability request. Removal may also restore inventory, so the existing requests-only endpoint cannot blindly replace this pair; the eventual single call must own both changes. |
| `HTTP-RW-03` | `frontend/src/app/activity/components/event-resource-popup/event-resource-popup.component.ts:3857` | `loadOwnedAssetDetailById` at 3861, then `saveOwnedAsset` at 3865 | Synchronizes manual assignment requests. It is called once per dirty card by the loop at 3850, so the current cost is two HTTP calls per card. This can use `saveOwnedAssetRequests` unless the server contract review finds a missing invariant. |

## Conditional cold-state pairs

| ID | Location | Potential consecutive calls | Notes |
| --- | --- | --- | --- |
| `HTTP-RW-04` | `frontend/src/app/profile/components/contacts-popup/contacts-popup.component.ts:761` | `ensureContactsLoadedForActiveUser` at 766 can call HTTP `loadContacts` at 1117, followed by `saveContacts` at 787 | Create/edit one contact. In the normal rendered-list path the prior SmartList load usually makes `ensure` a no-op, but the method itself permits GET then PUT. |
| `HTTP-RW-05` | Same component at 792 | `ensureContactsLoadedForActiveUser` at 798 can load, followed by `deleteContact` at 799 | Delete one contact. The second call is already targeted; only the conditional preliminary load needs to be proven necessary or removed. |
| `HTTP-RW-06` | Same component at 844 | `ensureContactsLoadedForActiveUser` at 849 can load, followed by `saveContacts` at 873 | Add selected contacts. Normal UI hydration may avoid the GET; cold/in-flight behavior still permits it. |
| `HTTP-RW-07` | `frontend/src/app/shared/ui/components/core/form/popups/profile-experience-manager/profile-experience-manager.component.ts:906` | `loadUserExperiences` at 911, conditionally followed by `saveUserExperiences` at 916 | The second HTTP call occurs when non-empty input entries differ from the loaded entries. This appears to be seed/input reconciliation, but it is still a literal GET then POST and must be either justified by an explicit contract or changed. |

## Fixed reference

`frontend/src/app/asset/components/asset-popup/asset-popup.component.ts:2377`
now performs one `saveOwnedAssetRequests` call instead of loading and then
upserting the asset.

## Next-session review

- Recheck the seven locations against current HEAD.
- Fix `HTTP-RW-01/02/03` as one-call operations. `HTTP-RW-02` also changes
  inventory.
- Verify whether `HTTP-RW-04/05/06` can enter the cold-load branch during a
  mutation.
- Decide whether the automatic write in `HTTP-RW-07` is required.
- Keep cache-only and service-cleanup work out of this task.
