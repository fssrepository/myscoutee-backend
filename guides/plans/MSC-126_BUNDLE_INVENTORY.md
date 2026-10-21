# MSC-126 1.4.5 bundle inventory

Per-file Python gzip level 9 estimates accompany actual emitted byte sizes; these are not Lighthouse scores. `app-sw.js` is separate from application chunks; static asset scripts outside the root are outside this count.

| Build | App chunks | Root JS incl. worker | Startup files | Startup raw | Startup gzip |
| --- | ---: | ---: | ---: | ---: | ---: |
| main-http | 82 | 83 | 2 | 3,364,043 | 772,449 |
| main-standalone | 81 | 82 | 2 | 4,061,631 | 989,635 |
| template-http | 31 | 32 | 2 | 2,262,298 | 506,940 |
| template-standalone | 27 | 28 | 2 | 2,574,207 | 627,305 |

Main HTTP has 82 application chunks plus one worker, explaining 83 root JS files. HTTP startup contains no local service/seed bytes; standalone startup contains no HTTP service bytes. The EN JSON contribution is 21 bytes of catalog-version metadata. Required backend-cache models/mappers remain.

The approximate 200 KB preference is not met by all files: main HTTP has three chunks above 200 KiB gzip (landing, lazy demo seed, local adapters). Current feature increments are grouped into one additional chunk each.

## Main HTTP feature increments

Additional dependencies after the member/admin/operator shell. These use the existing Node/zlib level 9 graph inspector; gzip estimates can differ slightly from Python. They are not timed interaction measurements.

| Feature | Existing shell | Added chunks | Gzip bytes |
| --- | --- | ---: | ---: |
| activity | fromMember | 1 | 71,485 |
| assets | fromMember | 1 | 59,636 |
| resource | fromMember | 1 | 59,741 |
| explore | fromMember | 1 | 25,058 |
| members | fromMember | 1 | 23,494 |
| contacts | fromMember | 1 | 18,929 |
| adminReports | fromAdmin | 1 | 33,311 |
| adminMonitoring | fromAdmin | 1 | 12,375 |
| operatorRegistry | fromOperator | 1 | 6,605 |
| operatorAction | fromOperator | 1 | 35,371 |

## main-http

Build `d9e2a1c84934-20261021232116`, app `1.4.5`. Entry roots show up to three importing entries, with an additional-consumer count. Startup membership does not mean every consumer executes on landing.

| File | Phase | Raw bytes | Gzip bytes | Importing entry roots |
| --- | --- | ---: | ---: | --- |
| `chunk-fa4a8b6d.js` | lazy/shared | 4,954,598 | 896,823 | shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-7b302861.js` | startup | 3,106,312 | 689,538 | home/components/home/home; app.config; entry/components/profile-onboarding-popup/profile-onboarding-popup; +79 |
| `chunk-8d66e392.js` | lazy/shared | 762,605 | 226,272 | shared/core/base/local-adapters |
| `chunk-4d5027fa.js` | lazy/shared | 761,421 | 172,018 | home/components/home/home; entry/components/profile-onboarding-popup/profile-onboarding-popup; admin/components/admin-help-session-page/admin-help-session-page; +51 |
| `chunk-7f72313d.js` | lazy/shared | 364,450 | 99,154 | shared/core/local/seed/services/platform/demo-bootstrap.service |
| `main-8c0be072.js` | startup | 257,731 | 82,911 | home/components/home/home; app.config; entry/components/profile-onboarding-popup/profile-onboarding-popup; +83 |
| `chunk-5ae9ab53.js` | lazy/shared | 357,767 | 71,273 | activity/components/activities-popup/activities-popup |
| `chunk-30bf92b4.js` | lazy/shared | 338,017 | 59,774 | activity/components/event-resource-popup/asset-view/event-resource-asset-view; activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog; activity/components/event-resource-popup/event-resource-popup |
| `chunk-50b8cd1a.js` | lazy/shared | 279,584 | 59,569 | asset/components/asset-availability-popup/asset-availability-popup; asset/components/asset-popup/asset-popup |
| `chunk-5d5cdbf0.js` | lazy/shared | 171,526 | 45,363 | shared/core/base/local-adapters; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-52c3c9f7.js` | lazy/shared | 196,064 | 45,348 | activity/components/event-chat-popup/event-chat-popup |
| `chunk-12ca7a0d.js` | lazy/shared | 199,777 | 42,761 | activity/components/event-editor-popup/event-editor-popup |
| `chunk-ade9114c.js` | lazy/shared | 208,576 | 36,804 | profile/components/profile-editor/profile-editor |
| `chunk-0d83f5e7.js` | lazy/shared | 287,350 | 36,669 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js |
| `chunk-5c430a31.js` | lazy/shared | 183,955 | 35,250 | operator/components/operator-action-popup/operator-action-popup |
| `chunk-ecda7f2a.js` | lazy/shared | 185,494 | 33,842 | shared/ui/components/explanation-popup/explanation-popup |
| `chunk-472231e3.js` | lazy/shared | 201,507 | 33,308 | admin/components/reports-popup/admin-reports-popup |
| `chunk-1d36f837.js` | lazy/shared | 130,684 | 28,603 | home/components/home/home; home/components/home-game-filter-popup/home-game-filter-popup; shared/ui/components/campaigns-popup/campaigns-popup; +2 |
| `chunk-1703c2ae.js` | lazy/shared | 158,849 | 28,393 | admin/components/help-editor-popup/admin-help-editor-popup |
| `chunk-433503fa.js` | lazy/shared | 147,688 | 27,082 | admin/components/notifications-popup/admin-notifications-popup |
| `chunk-a4254e58.js` | lazy/shared | 127,894 | 25,001 | activity/components/event-explore-popup/event-explore-popup |
| `chunk-56fb9e68.js` | lazy/shared | 134,112 | 23,431 | activity/components/event-members-popup/event-members-popup |
| `chunk-4cf30952.js` | lazy/shared | 76,320 | 22,590 | shared/core/base/services/accounts/firebase-auth.service |
| `chunk-f908166c.js` | lazy/shared | 116,319 | 21,114 | activity/components/event-tournament-groups-popup/event-tournament-groups-popup |
| `chunk-42377840.js` | lazy/shared | 108,663 | 20,436 | admin/components/idea-editor-popup/admin-idea-editor-popup |
| `chunk-f4c84419.js` | lazy/shared | 116,205 | 20,312 | shared/ui/components/feedback-popup/feedback-popup |
| `chunk-1c668093.js` | lazy/shared | 118,827 | 19,535 | admin/components/stats-popup/admin-stats-popup |
| `chunk-94bea9cb.js` | lazy/shared | 74,903 | 19,448 | activity/components/event-resource-popup/asset-explore/event-resource-asset-explore |
| `chunk-b95e71d7.js` | lazy/shared | 98,141 | 18,876 | profile/components/contacts-popup/contacts-popup |
| `chunk-9c233ef1.js` | lazy/shared | 68,954 | 18,728 | components/dist/fesm2022/components-route-input-popup.component-CkNPqU_h.mjs |
| `chunk-fada799c.js` | lazy/shared | 85,264 | 14,911 | activity/components/event-supply-contributions-popup/event-supply-contributions-popup |
| `chunk-c318823e.js` | lazy/shared | 90,263 | 14,623 | admin/components/params-popup/admin-params-popup |
| `chunk-cc90b453.js` | lazy/shared | 60,041 | 14,127 | home/components/home-game-filter-popup/home-game-filter-popup |
| `chunk-8ec5a362.js` | lazy/shared | 49,016 | 12,755 | activity/components/event-subevents-list-popup/event-subevents-list-popup |
| `chunk-a29cb403.js` | lazy/shared | 76,648 | 12,341 | admin/components/monitoring-popup/admin-monitoring-popup |
| `chunk-9a5dde58.js` | lazy/shared | 41,699 | 12,305 | shared/ui/components/payment-methods-popup/payment-methods-popup |
| `chunk-b0945eb7.js` | lazy/shared | 45,557 | 11,978 | shared/ui/components/community-cases-popup/community-cases-popup |
| `chunk-29b2b7e2.js` | lazy/shared | 65,022 | 11,866 | activity/components/event-resource-popup/asset-explore-borrow-dialog/event-resource-asset-explore-borrow-dialog |
| `chunk-24407ed0.js` | lazy/shared | 64,500 | 10,801 | shared/ui/components/core/form/inputs/pricing-editor/pricing-editor-popup/pricing-editor-popup |
| `chunk-a587f985.js` | lazy/shared | 53,567 | 10,578 | profile/components/impressions-popup/impressions-popup |
| `chunk-9d010ebf.js` | lazy/shared | 34,283 | 9,449 | activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup |
| `chunk-a10e9730.js` | lazy/shared | 31,660 | 8,567 | profile/components/profile-view-popup/profile-view-popup; shared/ui/components/campaigns-popup/campaigns-popup |
| `chunk-2b1daa3f.js` | lazy/shared | 25,856 | 7,990 | shared/ui/components/chat-call-popup/chat-call-popup; activity/components/event-chat-popup/event-chat-popup |
| `chunk-48e38989.js` | lazy/shared | 28,908 | 7,784 | shared/ui/components/chat-call-popup/chat-call-popup |
| `chunk-b7600a66.js` | lazy/shared | 26,967 | 7,247 | shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector |
| `chunk-37cdc174.js` | lazy/shared | 29,363 | 6,895 | profile/components/settings-popups/settings-popups |
| `chunk-a2b1fcc7.js` | lazy/shared | 26,505 | 6,571 | operator/components/operator-registry-popup/operator-registry-popup |
| `chunk-37a61a2a.js` | lazy/shared | 22,770 | 6,234 | admin/components/feedback-popup/admin-feedback-popup |
| `chunk-a53f5022.js` | lazy/shared | 24,699 | 6,219 | entry/components/entry-firebase-auth-popup/entry-firebase-auth-popup |
| `chunk-6a11dc8b.js` | lazy/shared | 17,049 | 5,589 | shared/ui/components/campaigns-popup/campaigns-popup |
| `chunk-29f911e0.js` | lazy/shared | 16,315 | 5,489 | operator/components/operator-page/operator-page |
| `chunk-e540a5ff.js` | lazy/shared | 17,152 | 5,372 | asset/components/asset-member-picker-popup/asset-member-picker-popup |
| `chunk-22226a64.js` | lazy/shared | 14,817 | 5,298 | admin/components/content-moderation-popup/content-moderation-popup |
| `chunk-1d43048b.js` | lazy/shared | 14,647 | 5,260 | shared/ui/components/community-announcements/community-announcements |
| `chunk-d5754bac.js` | lazy/shared | 19,347 | 5,196 | admin/admin.module |
| `chunk-5485bf18.js` | lazy/shared | 19,617 | 4,789 | profile/components/integration-settings-popup/mcp-authorization |
| `chunk-39df671e.js` | lazy/shared | 16,045 | 4,713 | admin/components/affinity-graph-popup/admin-affinity-graph-popup |
| `chunk-ccdf6cde.js` | lazy/shared | 13,188 | 4,527 | shared/ui/components/notification-center-popup/notification-center-popup |
| `chunk-1ef347bb.js` | lazy/shared | 11,500 | 3,927 | shared/ui/components/service-offerings/service-offerings-popup |
| `chunk-0ba2a3f4.js` | lazy/shared | 10,884 | 3,733 | shared/ui/components/community-groups-popup/community-group-editor |
| `chunk-256a2b83.js` | lazy/shared | 9,680 | 3,627 | shared/ui/components/photo-feed-popup/photo-feed-popup |
| `chunk-6e0ded43.js` | lazy/shared | 10,049 | 3,308 | shared/ui/components/feedback-rated-detail-popup/feedback-rated-detail-popup |
| `chunk-ff8fc60e.js` | lazy/shared | 8,238 | 3,271 | home/components/community-services-home/community-services-home; shared/ui/components/service-offerings/service-offerings-popup |
| `chunk-f6b96172.js` | lazy/shared | 8,532 | 2,995 | entry/components/profile-onboarding-popup/profile-onboarding-popup |
| `chunk-986e050b.js` | lazy/shared | 7,510 | 2,857 | admin/components/admin-help-session-page/admin-help-session-page; admin/admin.module |
| `chunk-aa15c55d.js` | lazy/shared | 7,640 | 2,731 | admin/components/payment-simulator-popup/admin-payment-simulator-popup |
| `chunk-9ca8baac.js` | lazy/shared | 5,330 | 2,442 | home/components/community-services-home/community-services-home |
| `chunk-71ab8f8d.js` | lazy/shared | 4,298 | 1,818 | activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-add-popup |
| `chunk-5ad7d91f.js` | lazy/shared | 3,153 | 1,410 | shared/ui/components/core/form/inputs/policies-input/policies-input-popup/policies-input-popup |
| `chunk-5486c660.js` | lazy/shared | 3,148 | 1,400 | shared/ui/components/feedback-evaluation/feedback-evaluation-popup |
| `chunk-7c65301b.js` | lazy/shared | 2,213 | 1,148 | shared/ui/components/external-invite-popup/external-invite-popup |
| `chunk-a65c8a0a.js` | lazy/shared | 2,037 | 1,076 | shared/ui/components/payment-methods-popup/payment-methods-popup; profile/components/profile-editor/profile-editor |
| `chunk-6cef9e72.js` | lazy/shared | 1,447 | 607 | shared/core/local/seed/data/landing-slides-dating.json |
| `chunk-61d142fd.js` | lazy/shared | 1,404 | 524 | shared/core/local/seed/data/landing-slides-community.json |
| `chunk-71da6c57.js` | lazy/shared | 1,351 | 512 | shared/core/local/seed/data/landing-slides-work.json |
| `chunk-ce9e8812.js` | lazy/shared | 1,064 | 461 | shared/core/http/services/accounts/firebase-session-registry.service |
| `chunk-4015b0c2.js` | lazy/shared | 717 | 457 | shared/core/http/services/operator/operator-bootstrap-auth.service |
| `chunk-b4e1a383.js` | lazy/shared | 766 | 426 | shared/core/local/seed/services/platform/demo-bootstrap.service; shared/core/local/seed/data/deployment-configuration.json |
| `chunk-b719f472.js` | lazy/shared | 403 | 286 | shared/core/local/seed/services/platform/static-content.service |
| `chunk-58ba7b76.js` | lazy/shared | 266 | 196 | shared/core/local/seed/data/deployment-configuration.json |
| `chunk-6834a1de.js` | lazy/shared | 162 | 135 | admin/components/admin-help-session-page/admin-help-session-page |
| `chunk-627738fc.js` | lazy/shared | 147 | 125 | profile/components/profile-view-popup/profile-view-popup |

## main-standalone

Build `1.4.5`, app `1.4.5`. Entry roots show up to three importing entries, with an additional-consumer count. Startup membership does not mean every consumer executes on landing.

| File | Phase | Raw bytes | Gzip bytes | Importing entry roots |
| --- | --- | ---: | ---: | --- |
| `chunk-7d535711.js` | startup | 3,803,946 | 906,752 | home/components/home/home; app.config; entry/components/profile-onboarding-popup/profile-onboarding-popup; +79 |
| `chunk-7801813e.js` | lazy/shared | 4,954,587 | 896,815 | shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-34f32aa2.js` | lazy/shared | 759,295 | 171,365 | home/components/home/home; entry/components/profile-onboarding-popup/profile-onboarding-popup; admin/components/admin-help-session-page/admin-help-session-page; +49 |
| `chunk-fc072fcb.js` | lazy/shared | 364,331 | 99,107 | shared/core/local/seed/services/platform/demo-bootstrap.service |
| `main-4c5d0d7e.js` | startup | 257,685 | 82,883 | home/components/home/home; app.config; entry/components/profile-onboarding-popup/profile-onboarding-popup; +83 |
| `chunk-a3e67083.js` | lazy/shared | 357,786 | 71,283 | activity/components/activities-popup/activities-popup |
| `chunk-e59649ae.js` | lazy/shared | 338,027 | 59,784 | activity/components/event-resource-popup/asset-view/event-resource-asset-view; activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog; activity/components/event-resource-popup/event-resource-popup |
| `chunk-2c60bc6a.js` | lazy/shared | 279,588 | 59,575 | asset/components/asset-availability-popup/asset-availability-popup; asset/components/asset-popup/asset-popup |
| `chunk-deedfae3.js` | lazy/shared | 238,490 | 51,952 | shared/core/base/http-adapters |
| `chunk-204c2a9a.js` | lazy/shared | 196,074 | 45,359 | activity/components/event-chat-popup/event-chat-popup |
| `chunk-7d49eeb4.js` | lazy/shared | 199,791 | 42,769 | activity/components/event-editor-popup/event-editor-popup |
| `chunk-8110b5c8.js` | lazy/shared | 208,576 | 36,806 | profile/components/profile-editor/profile-editor |
| `chunk-b607ff03.js` | lazy/shared | 287,350 | 36,669 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js |
| `chunk-2a1deedd.js` | lazy/shared | 183,960 | 35,248 | operator/components/operator-action-popup/operator-action-popup |
| `chunk-e46acb03.js` | lazy/shared | 185,494 | 33,844 | shared/ui/components/explanation-popup/explanation-popup |
| `chunk-207d679b.js` | lazy/shared | 201,507 | 33,306 | admin/components/reports-popup/admin-reports-popup |
| `chunk-90efa8f4.js` | lazy/shared | 158,848 | 28,390 | admin/components/help-editor-popup/admin-help-editor-popup |
| `chunk-acedcf54.js` | lazy/shared | 129,411 | 28,246 | home/components/home/home; home/components/home-game-filter-popup/home-game-filter-popup; shared/ui/components/campaigns-popup/campaigns-popup |
| `chunk-1e7184b2.js` | lazy/shared | 147,688 | 27,079 | admin/components/notifications-popup/admin-notifications-popup |
| `chunk-775df490.js` | lazy/shared | 127,904 | 25,009 | activity/components/event-explore-popup/event-explore-popup |
| `chunk-c579bb3d.js` | lazy/shared | 134,122 | 23,436 | activity/components/event-members-popup/event-members-popup |
| `chunk-d75e4b4a.js` | lazy/shared | 76,319 | 22,588 | shared/core/base/services/accounts/firebase-auth.service |
| `chunk-c3b744d2.js` | lazy/shared | 116,329 | 21,110 | activity/components/event-tournament-groups-popup/event-tournament-groups-popup |
| `chunk-1e4f71b7.js` | lazy/shared | 108,663 | 20,430 | admin/components/idea-editor-popup/admin-idea-editor-popup |
| `chunk-0cba054b.js` | lazy/shared | 116,209 | 20,317 | shared/ui/components/feedback-popup/feedback-popup |
| `chunk-91809c6b.js` | lazy/shared | 118,832 | 19,533 | admin/components/stats-popup/admin-stats-popup |
| `chunk-fe7641df.js` | lazy/shared | 74,918 | 19,461 | activity/components/event-resource-popup/asset-explore/event-resource-asset-explore |
| `chunk-c6561983.js` | lazy/shared | 98,146 | 18,884 | profile/components/contacts-popup/contacts-popup |
| `chunk-5fa8b79f.js` | lazy/shared | 68,954 | 18,723 | components/dist/fesm2022/components-route-input-popup.component-CkNPqU_h.mjs |
| `chunk-ddb6192b.js` | lazy/shared | 85,269 | 14,918 | activity/components/event-supply-contributions-popup/event-supply-contributions-popup |
| `chunk-371c3fbf.js` | lazy/shared | 90,268 | 14,619 | admin/components/params-popup/admin-params-popup |
| `chunk-3d21d807.js` | lazy/shared | 60,041 | 14,127 | home/components/home-game-filter-popup/home-game-filter-popup |
| `chunk-24dede6a.js` | lazy/shared | 49,026 | 12,762 | activity/components/event-subevents-list-popup/event-subevents-list-popup |
| `chunk-4c15a4e0.js` | lazy/shared | 76,653 | 12,337 | admin/components/monitoring-popup/admin-monitoring-popup |
| `chunk-9a0300b4.js` | lazy/shared | 41,704 | 12,305 | shared/ui/components/payment-methods-popup/payment-methods-popup |
| `chunk-466938b7.js` | lazy/shared | 45,557 | 11,981 | shared/ui/components/community-cases-popup/community-cases-popup |
| `chunk-be43cc2e.js` | lazy/shared | 65,022 | 11,862 | activity/components/event-resource-popup/asset-explore-borrow-dialog/event-resource-asset-explore-borrow-dialog |
| `chunk-0a79ab9b.js` | lazy/shared | 64,504 | 10,803 | shared/ui/components/core/form/inputs/pricing-editor/pricing-editor-popup/pricing-editor-popup |
| `chunk-a7004d09.js` | lazy/shared | 53,572 | 10,578 | profile/components/impressions-popup/impressions-popup |
| `chunk-18ee7902.js` | lazy/shared | 34,283 | 9,446 | activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup |
| `chunk-7844244a.js` | lazy/shared | 31,660 | 8,564 | profile/components/profile-view-popup/profile-view-popup; shared/ui/components/campaigns-popup/campaigns-popup |
| `chunk-46a2bfcc.js` | lazy/shared | 25,856 | 7,991 | shared/ui/components/chat-call-popup/chat-call-popup; activity/components/event-chat-popup/event-chat-popup |
| `chunk-25d6d7aa.js` | lazy/shared | 28,913 | 7,788 | shared/ui/components/chat-call-popup/chat-call-popup |
| `chunk-3ae88d3b.js` | lazy/shared | 26,967 | 7,247 | shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector |
| `chunk-89192673.js` | lazy/shared | 29,368 | 6,892 | profile/components/settings-popups/settings-popups |
| `chunk-9a5f5b93.js` | lazy/shared | 26,506 | 6,576 | operator/components/operator-registry-popup/operator-registry-popup |
| `chunk-59c099ba.js` | lazy/shared | 22,770 | 6,232 | admin/components/feedback-popup/admin-feedback-popup |
| `chunk-36a1e740.js` | lazy/shared | 24,699 | 6,219 | entry/components/entry-firebase-auth-popup/entry-firebase-auth-popup |
| `chunk-c6f5c038.js` | lazy/shared | 17,061 | 5,591 | shared/ui/components/campaigns-popup/campaigns-popup |
| `chunk-2706d7dd.js` | lazy/shared | 16,315 | 5,489 | operator/components/operator-page/operator-page |
| `chunk-342ee649.js` | lazy/shared | 17,157 | 5,375 | asset/components/asset-member-picker-popup/asset-member-picker-popup |
| `chunk-162654dc.js` | lazy/shared | 14,816 | 5,298 | admin/components/content-moderation-popup/content-moderation-popup |
| `chunk-8ee8234f.js` | lazy/shared | 14,647 | 5,264 | shared/ui/components/community-announcements/community-announcements |
| `chunk-fce04006.js` | lazy/shared | 19,352 | 5,199 | admin/admin.module |
| `chunk-5090bf1d.js` | lazy/shared | 19,617 | 4,791 | profile/components/integration-settings-popup/mcp-authorization |
| `chunk-ac65b54a.js` | lazy/shared | 16,045 | 4,709 | admin/components/affinity-graph-popup/admin-affinity-graph-popup |
| `chunk-1f5d5dfe.js` | lazy/shared | 13,189 | 4,527 | shared/ui/components/notification-center-popup/notification-center-popup |
| `chunk-fc51626a.js` | lazy/shared | 11,501 | 3,933 | shared/ui/components/service-offerings/service-offerings-popup |
| `chunk-af0f2598.js` | lazy/shared | 10,884 | 3,730 | shared/ui/components/community-groups-popup/community-group-editor |
| `chunk-2c13b697.js` | lazy/shared | 9,679 | 3,623 | shared/ui/components/photo-feed-popup/photo-feed-popup |
| `chunk-2fe8fd5a.js` | lazy/shared | 10,049 | 3,304 | shared/ui/components/feedback-rated-detail-popup/feedback-rated-detail-popup |
| `chunk-2acec867.js` | lazy/shared | 8,239 | 3,266 | home/components/community-services-home/community-services-home; shared/ui/components/service-offerings/service-offerings-popup |
| `chunk-ee348dc8.js` | lazy/shared | 8,532 | 2,994 | entry/components/profile-onboarding-popup/profile-onboarding-popup |
| `chunk-e9d738bd.js` | lazy/shared | 7,510 | 2,857 | admin/components/admin-help-session-page/admin-help-session-page; admin/admin.module |
| `chunk-f6fd177f.js` | lazy/shared | 7,634 | 2,726 | admin/components/payment-simulator-popup/admin-payment-simulator-popup |
| `chunk-ecedd83a.js` | lazy/shared | 5,331 | 2,442 | home/components/community-services-home/community-services-home |
| `chunk-be494599.js` | lazy/shared | 4,298 | 1,819 | activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-add-popup |
| `chunk-00ed35d5.js` | lazy/shared | 3,153 | 1,408 | shared/ui/components/core/form/inputs/policies-input/policies-input-popup/policies-input-popup |
| `chunk-4a322176.js` | lazy/shared | 3,148 | 1,401 | shared/ui/components/feedback-evaluation/feedback-evaluation-popup |
| `chunk-e2fa1d4b.js` | lazy/shared | 2,213 | 1,147 | shared/ui/components/external-invite-popup/external-invite-popup |
| `chunk-06aafab6.js` | lazy/shared | 2,042 | 1,078 | shared/ui/components/payment-methods-popup/payment-methods-popup; profile/components/profile-editor/profile-editor |
| `chunk-6cef9e72.js` | lazy/shared | 1,447 | 607 | shared/core/local/seed/data/landing-slides-dating.json |
| `chunk-61d142fd.js` | lazy/shared | 1,404 | 524 | shared/core/local/seed/data/landing-slides-community.json |
| `chunk-71da6c57.js` | lazy/shared | 1,351 | 512 | shared/core/local/seed/data/landing-slides-work.json |
| `chunk-0c630142.js` | lazy/shared | 1,064 | 460 | shared/core/http/services/accounts/firebase-session-registry.service |
| `chunk-49ebb71f.js` | lazy/shared | 717 | 457 | shared/core/http/services/operator/operator-bootstrap-auth.service |
| `chunk-b4e1a383.js` | lazy/shared | 766 | 426 | shared/core/local/seed/services/platform/demo-bootstrap.service; shared/core/local/seed/data/deployment-configuration.json |
| `chunk-e89e9a1d.js` | lazy/shared | 403 | 285 | shared/core/local/seed/services/platform/static-content.service |
| `chunk-58ba7b76.js` | lazy/shared | 266 | 196 | shared/core/local/seed/data/deployment-configuration.json |
| `chunk-4bf07d52.js` | lazy/shared | 162 | 135 | admin/components/admin-help-session-page/admin-help-session-page |
| `chunk-62c0dfd3.js` | lazy/shared | 147 | 125 | profile/components/profile-view-popup/profile-view-popup |

## template-http

Build `4246fafa92ff-20261021232155`, app `1.4.5`. Entry roots show up to three importing entries, with an additional-consumer count. Startup membership does not mean every consumer executes on landing.

| File | Phase | Raw bytes | Gzip bytes | Importing entry roots |
| --- | --- | ---: | ---: | --- |
| `chunk-521687a3.js` | startup | 2,018,876 | 428,057 | profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; operator/components/operator-configuration-popup/operator-configuration-popup; +22 |
| `chunk-43b09c63.js` | lazy/shared | 269,076 | 104,425 | shared/core/base/local-adapters; shared/core/local/source/services/accounts/users.service |
| `main-c179497a.js` | startup | 243,422 | 78,883 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js; profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; +26 |
| `chunk-a4a9c4e5.js` | lazy/shared | 183,363 | 46,934 | profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; operator/components/operator-configuration-popup/operator-configuration-popup; +3 |
| `chunk-07ac1b86.js` | lazy/shared | 287,350 | 36,670 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js |
| `chunk-671474fe.js` | lazy/shared | 87,733 | 27,547 | shared/core/base/local-adapters |
| `chunk-8c98ceab.js` | lazy/shared | 159,227 | 25,846 | profile/components/profile-editor/profile-editor |
| `chunk-dfe421f9.js` | lazy/shared | 75,987 | 22,492 | shared/core/base/services/accounts/firebase-auth.service |
| `chunk-825e5d71.js` | lazy/shared | 68,938 | 18,707 | components/dist/fesm2022/components-route-input-popup.component-CkNPqU_h.mjs |
| `chunk-904687c7.js` | lazy/shared | 88,370 | 16,973 | operator/components/operator-configuration-popup/operator-configuration-popup |
| `chunk-efba2f29.js` | lazy/shared | 40,594 | 11,402 | shared/ui/components/explanation-popup/explanation-popup |
| `chunk-92c1150b.js` | lazy/shared | 47,461 | 7,765 | shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-b8b03cbe.js` | lazy/shared | 26,823 | 7,194 | shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector |
| `chunk-ed8a951c.js` | lazy/shared | 31,297 | 6,921 | operator/components/operator-update-popup/operator-update-popup |
| `chunk-bc7d0cbe.js` | lazy/shared | 14,097 | 5,033 | shared/ui/components/notification-center-popup/notification-center-popup |
| `chunk-5e17ff83.js` | lazy/shared | 19,842 | 4,859 | profile/components/integration-settings-popup/mcp-authorization |
| `chunk-4a7db5d5.js` | lazy/shared | 10,732 | 3,410 | shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-942bb4aa.js` | lazy/shared | 11,137 | 3,142 | shared/core/base/local-adapters; shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service; +2 |
| `chunk-29c0d52b.js` | lazy/shared | 9,387 | 2,954 | shared/ui/components/app-setup-popup/app-setup-popup |
| `chunk-6a3e503b.js` | lazy/shared | 8,159 | 2,362 | profile/components/settings-popups/settings-popups |
| `chunk-583411cc.js` | lazy/shared | 5,989 | 1,842 | shared/core/base/local-adapters; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-66d003f9.js` | lazy/shared | 4,909 | 1,282 | shared/core/base/local-adapters; shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-131c1f14.js` | lazy/shared | 1,315 | 599 | profile/components/profile-editor/profile-editor; profile/components/integration-settings-popup/mcp-authorization |
| `chunk-28ad50fa.js` | lazy/shared | 1,059 | 459 | shared/core/http/services/accounts/firebase-session-registry.service |
| `chunk-e677b47f.js` | lazy/shared | 716 | 458 | shared/core/http/services/operator/operator-bootstrap-auth.service |
| `chunk-9e4537a4.js` | lazy/shared | 1,571 | 444 | shared/core/local/seed/services/platform/demo-bootstrap.service; shared/core/local/seed/data/users.json |
| `chunk-5985759e.js` | lazy/shared | 471 | 289 | shared/core/local/seed/data/deployment-configuration.json |
| `chunk-276a34f4.js` | lazy/shared | 185 | 140 | shared/core/local/seed/services/platform/static-content.service |
| `chunk-be377511.js` | lazy/shared | 150 | 122 | shared/core/local/source/services/accounts/users.service |
| `chunk-401bcf4a.js` | lazy/shared | 168 | 119 | shared/core/common/app.db |
| `chunk-f259902a.js` | lazy/shared | 57 | 75 | shared/core/local/seed/data/users.json |

## template-standalone

Build `1.4.5`, app `1.4.5`. Entry roots show up to three importing entries, with an additional-consumer count. Startup membership does not mean every consumer executes on landing.

| File | Phase | Raw bytes | Gzip bytes | Importing entry roots |
| --- | --- | ---: | ---: | --- |
| `chunk-66ae0f6e.js` | startup | 2,336,182 | 550,127 | profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; operator/components/operator-configuration-popup/operator-configuration-popup; +22 |
| `main-8d94eb2e.js` | startup | 238,025 | 77,178 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js; profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; +26 |
| `chunk-505d98e8.js` | lazy/shared | 183,363 | 46,938 | profile/components/settings-popups/settings-popups; shared/ui/components/notification-center-popup/notification-center-popup; operator/components/operator-configuration-popup/operator-configuration-popup; +3 |
| `chunk-c02e47e2.js` | lazy/shared | 287,350 | 36,669 | node_modules/@wireapp/core-crypto/dist/browser/corecrypto.js |
| `chunk-d8c0058b.js` | lazy/shared | 159,227 | 25,849 | profile/components/profile-editor/profile-editor |
| `chunk-34b7d82a.js` | lazy/shared | 75,992 | 22,492 | shared/core/base/services/accounts/firebase-auth.service |
| `chunk-7d44d781.js` | lazy/shared | 68,938 | 18,708 | components/dist/fesm2022/components-route-input-popup.component-CkNPqU_h.mjs |
| `chunk-04bdd2ee.js` | lazy/shared | 88,370 | 16,975 | operator/components/operator-configuration-popup/operator-configuration-popup |
| `chunk-e50471f1.js` | lazy/shared | 56,542 | 13,709 | shared/core/base/http-adapters |
| `chunk-84aac333.js` | lazy/shared | 40,594 | 11,400 | shared/ui/components/explanation-popup/explanation-popup |
| `chunk-8882c177.js` | lazy/shared | 47,410 | 7,751 | shared/core/local/seed/services/platform/static-content.service; shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-bfcdb30d.js` | lazy/shared | 26,823 | 7,193 | shared/ui/components/demo-bootstrap-selector/demo-bootstrap-selector |
| `chunk-4d932d9c.js` | lazy/shared | 31,297 | 6,922 | operator/components/operator-update-popup/operator-update-popup |
| `chunk-2307ac8d.js` | lazy/shared | 14,075 | 5,016 | shared/ui/components/notification-center-popup/notification-center-popup |
| `chunk-24cbe3cb.js` | lazy/shared | 19,842 | 4,858 | profile/components/integration-settings-popup/mcp-authorization |
| `chunk-223ea88d.js` | lazy/shared | 10,660 | 3,394 | shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-6b59798f.js` | lazy/shared | 9,387 | 2,955 | shared/ui/components/app-setup-popup/app-setup-popup |
| `chunk-c8788d7d.js` | lazy/shared | 8,159 | 2,357 | profile/components/settings-popups/settings-popups |
| `chunk-c42df148.js` | lazy/shared | 4,678 | 1,720 | shared/core/http/services/accounts/users.service; shared/core/base/http-adapters |
| `chunk-bc68995d.js` | lazy/shared | 1,315 | 597 | profile/components/profile-editor/profile-editor; profile/components/integration-settings-popup/mcp-authorization |
| `chunk-6fff5f82.js` | lazy/shared | 708 | 453 | shared/core/http/services/operator/operator-bootstrap-auth.service |
| `chunk-c45e9bd1.js` | lazy/shared | 1,051 | 453 | shared/core/http/services/accounts/firebase-session-registry.service |
| `chunk-9e4537a4.js` | lazy/shared | 1,571 | 444 | shared/core/local/seed/services/platform/demo-bootstrap.service |
| `chunk-5985759e.js` | lazy/shared | 471 | 289 | shared/core/local/seed/data/deployment-configuration.json |
| `chunk-c0d3d6c0.js` | lazy/shared | 129 | 120 | shared/core/local/seed/services/platform/static-content.service |
| `chunk-7c480b09.js` | lazy/shared | 121 | 112 | shared/core/http/services/accounts/users.service |
| `chunk-2081c94d.js` | lazy/shared | 0 | 20 | shared/core/local/seed/data/users.json |
