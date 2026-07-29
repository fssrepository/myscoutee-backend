/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-checkout-basket-purge";
  const expiredOne = F.fixtureId(job, "expired-1");
  const expiredTwo = F.fixtureId(job, "expired-2");
  const futureOne = F.fixtureId(job, "future-1");
  const userId = F.fixtureId(job, "user");
  const sourceId = F.fixtureId(job, "event");

  F.run({
    job,
    ruleKey: job,
    variations: ["mixed", "expired"],
    build(variation) {
      const ids = variation === "mixed"
        ? [expiredOne, futureOne]
        : [expiredOne, expiredTwo];
      const isolatedIds = F.collection("eventCheckoutBasketItems")
        .find({
          _id: { $nin: ids },
          status: { $in: ["draft", "confirmed", "waiting", "approval-pending", "approved"] },
          $or: [
            { resultState: { $exists: false } },
            { resultState: null },
            { resultState: { $in: ["pending", "active", "failed"] } }
          ],
          expiresAtIso: { $exists: true, $nin: ["", null], $lte: F.nowIso() }
        }, { projection: { _id: 1 } })
        .map(item => item._id)
        .toArray();
      return {
        pendingCount: 2,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "mixed"
          ? "Exactly one expired row changes resultState from active to deleted; the future row remains active."
          : "Both expired rows change resultState from active to deleted.",
        context: {
          ids,
          expiredIds: variation === "mixed" ? [expiredOne] : ids,
          futureIds: variation === "mixed" ? [futureOne] : [],
          isolatedIds
        },
        specs: [
          {
            collection: "eventCheckoutBasketItems",
            selector: { _id: { $in: [...isolatedIds, ...ids] } }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedIds || []).length > 0) {
        F.collection("eventCheckoutBasketItems").updateMany(
          { _id: { $in: context.isolatedIds } },
          {
            $set: {
              resultState: "admin-fixture-quarantined",
              updatedAtIso: now
            }
          }
        );
      }
      const expiredIds = context.expiredIds || [];
      const futureIds = context.futureIds || [];
      const documents = [];
      for (const id of expiredIds) {
        documents.push({
          _id: id,
          itemId: id,
          userId,
          sourceId,
          kind: "event",
          label: "Fixture expired checkout line",
          amount: 12.5,
          currency: "EUR",
          quantity: 1,
          status: "draft",
          resultState: "active",
          pendingCounterTracked: true,
          createdAtIso: now,
          updatedAtIso: now,
          expiresAtIso: F.pastIso(15)
        });
      }
      for (const id of futureIds) {
        documents.push({
          _id: id,
          itemId: id,
          userId,
          sourceId,
          kind: "event",
          label: "Fixture future checkout line",
          amount: 7.5,
          currency: "EUR",
          quantity: 1,
          status: "draft",
          resultState: "active",
          pendingCounterTracked: true,
          createdAtIso: now,
          updatedAtIso: now,
          expiresAtIso: F.futureIso(60)
        });
      }
      F.collection("eventCheckoutBasketItems").insertMany(documents);
    },
    status(context) {
      const ids = context.ids || [expiredOne, expiredTwo, futureOne];
      return {
        quarantinedPreexistingDueRows: (context.isolatedIds || []).length,
        items: F.collection("eventCheckoutBasketItems")
        .find({ _id: { $in: ids } })
        .sort({ _id: 1 })
        .map(item => ({
          id: item._id,
          status: item.status,
          resultState: item.resultState,
          expiresAtIso: item.expiresAtIso,
          updatedAtIso: item.updatedAtIso
        }))
        .toArray()
      };
    }
  });
})();
