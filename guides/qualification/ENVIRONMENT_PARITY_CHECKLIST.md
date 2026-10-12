# Environment and installation parity checklist

This reusable checklist covers MyScoutee and the minimal template. Development,
E2E, KVM and installed production must deliver the same selected application
contracts. Environment differences must have a concrete purpose and an existing
configuration owner. A successful build or source-file comparison does not prove
that installation, reset or upgrade produces the required runtime state.

Use this with the [deployment qualification guide](../releases/PRERELEASE_DEPLOYMENT_QUALIFICATION.md)
and its P01–P06 ownership, installation and rollback gates. Candidate results
belong in a separate evidence document; this file is the reusable procedure.

## Execution boundaries

- Fix the versioned source, installer, initializer, importer or migration that
  owns the defect. **Never repair the installed database by hand to make a
  broken installation appear successful.** Read-only database diagnosis is
  allowed. Any required database change must be delivered and replayed through
  the supported, versioned installation or upgrade path.
- Do not broaden a timeout, add an application fallback or change an environment
  solely to hide missing package inputs, indexes or initialization steps.
- Preserve operator configuration, real accounts, uploads and retained data.
  Only the explicitly guarded packaged `demo_db` reset is disposable.
- Run one application stack at a time. Shut down the VMware guest before E2E;
  stopping only its application does not release the VM's assigned memory.
- For this campaign, all remote qualification is on local VMware. **Do not access
  Netcup.** Portability to a future production host is a packaging requirement,
  not authorization to deploy there. Do not add GitHub Actions.
- Keep credentials outside Git. Record field names, counts and digests rather
  than secrets or full user records. No DEB upload: the user uploads those.

## Numbered checks

1. **Pin the candidate and preserve current state.** Record backend, frontend and
   components revisions; dirty files; version; exact JAR, image and DEB digests;
   target OS, limits and currently running stack. Preserve unrelated changes.
   Any candidate change invalidates the affected earlier evidence.

2. **Inventory every environment input.** Enumerate Spring properties, Compose
   files and overrides, `.env` templates and defaults, Dockerfiles/entrypoints,
   Nginx configuration, Kubernetes/Helm values and generated resources, systemd
   units, host/client scripts, importer policies, migration selections, Angular
   environments/build targets, frontend sync and E2E hooks. Include referenced
   files, not only the package builder's existing allow-list.

3. **Compare effective configuration.** Render DEV, E2E, source PROD, installed
   PROD and KVM independently using controlled nondefault values. Follow each
   variable to its consumer. Check missing forwarding, fallback values, aliases,
   secret-file paths and retained legacy environment merging. Classify every
   behavior-changing difference; do not blindly copy development credentials,
   debug flags or test capabilities into production.

4. **Verify identity and persistence isolation.** Trace REAL/DEMO/E2E session
   selection through API, database name, authentication database, importer source,
   media prefix and external-service target. Verify both projects have independent
   directories, volumes, databases, release identities and configuration keys.

5. **Audit all Mongo JSONs.** Parse every physical file under `demo_db`, `e2e_db`
   and `myscoutee_db`. Classify catalogs, configuration and runtime data. Compare
   shared records and explicitly allowed fixture differences; check IDs,
   references, schema versions and production exclusion of synthetic activity.
   Run `tools/seeds/check-system-seed-parity.py` in both repositories. Separate
   files are required for E2E; a symlink to DEV is not an isolated fixture.

6. **Trace every seed delivery path.** For every selected collection, follow
   source → package/image → import policy → fresh initialization → reset →
   retained upgrade. Account for empty collections as well as populated inputs.
   Do not assume an included JSON file is actually imported during an upgrade.

7. **Verify the complete index and schema contract.** Compare initializer,
   importer and versioned migration definitions, then inspect actual indexes
   after fresh install, demo reset, E2E reset and retained upgrade. Check names,
   ordered keys, uniqueness, partial filters, collation, sparse/TTL settings and
   explicitly obsolete constraints. Source equality alone cannot pass this gate.
   The existing input auditor can emit the read-only installed Mongo check:
   `python3 packaging/tests/deployment-input-parity-test.py --print-mongo-audit`.
   Run that emitted script with authenticated `mongosh` in the already-running
   installed Mongo container. It reads every packaged demo/production JSON and
   all selected indexes, reports counts/missing IDs/differing field names, and
   never writes records or indexes. Review operator/runtime differences under
   step 9; a successful script exit alone is not a parity verdict.

8. **Check the disposable reset lifecycle.** Verify Mongo's final daemon is
   ready, the target is exactly `demo_db`, REAL differs, complete canonical
   initialization is applied, all selected seeds load, and the oracle checks
   the project's actual retained features. Test retry/failure behavior and marker
   retention. Confirm production and unrelated MinIO keys remain unchanged.

9. **Classify retained production differences before fixing them.** Compare all
   delivered production catalogs/configuration against the installed database.
   Distinguish missing package defaults from operator customization, intentional
   deletion/deactivation and runtime-derived fields. Define record/field ownership
   and semantic identity before adding an immutable migration or seed-sync policy.
   Preserve overrides; never replace production wholesale from the DEV fixture.

10. **Prove migration and upgrade repeatability.** Exercise the supported old
    version, first upgrade, repeat upgrade, failure/retry and rollback boundaries.
    Preserve existing migration checksums. Test retained operator/user/media
    controls and new defaults together, including disabled/customized defaults.

11. **Compare all application and media payloads.** Run the existing
    `packaging/tests/deployment-input-parity-test.py` against the stage, actual
    images and actual DEB. Verify exact JAR and classpath resources, all frontend
    assets, Nginx includes, MinIO seeds/bootstrap, runtime helpers, migration
    inputs, templates, file modes and package control files. Repeat for template.

12. **Verify frontend modes and delivery.** Check local, dev, E2E, production and
    GitHub Pages build inputs, API paths, Firebase/runtime capability selection,
    service worker, assets, base paths and version badge. Verify DEV frontend sync
    and immutable installed assets. HTTP must not fall back to local fixtures.

13. **Verify supporting services and background work.** Check Mongo replica-set
    behavior, MinIO, MCP/API integration, email, STUN/video, localization/location,
    notifications, guide/consent, deletion/purge jobs, health checks and readiness
    dependencies. Apply the project's selected features; do not reintroduce
    excluded native domains into the template just to satisfy a copied check.

14. **Verify host portability and operation.** Check TLS/public CA trust,
    WebSocket and integration origins, ports, DNS, timezone mounts, secrets,
    users/permissions, persistent paths, update metadata/signatures, backup/restore
    tools, logs and monitoring. Use the documented localhost transport for
    VMware. Keep host-specific addresses in operator configuration.

15. **Run a coherent focused regression batch.** Reuse existing tests for
    package contents, environment rendering, seeds/indexes, reset, migrations,
    lifecycle and qualification. Include real Mongo tests for database semantics;
    mocked command success cannot prove the resulting indexes or data.

16. **Install the actual native candidate on VMware.** Use the supported
    installer, not copied files or direct database repair. Run read-only checks
    against the resulting data/indexes and retained controls. Require every
    selected service to be healthy; inspect logs and CPU as well as HTTP status.

17. **Verify the visible native browser.** Use the versioned managed launcher and
    canonical localhost URLs. Check guide, consent, demo-user loading and sign-in
    against the installed candidate. Execute the deployment guide's normal-account
    image smoke separately; demo login does not prove real registration. Preserve
    the separate four manual-QA tasks and their unexecuted status.

18. **Qualify the template independently.** Stop native, install template with
    its own state and repeat applicable data, configuration, reset, upgrade and
    visible-browser checks for its retained features. Do not carry native events,
    payments or moderation requirements into the minimal acceptance oracle.

19. **Validate E2E, KVM and monolith serially.** Shut down VMware first. Run the
    existing isolated E2E database preparation and affected backend/browser
    checks. Verify the completed backend batch on KVM and monolith with their
    own canonical startup paths. Include KVM Prometheus/Grafana and visible
    status/browser startup; record which boundary each result actually proves.

20. **Compare response time and CPU.** Use the same dataset, request sequence,
    concurrency, warmup and resource limits. Record both revisions and increases
    as well as decreases. Investigate the current slow demo selector with its
    complete user list; do not substitute a `limit=1` health check. Run stress
    only for a coherent batch or a concrete performance concern.

21. **Close and release only proven results.** Keep PASS, FAIL, BLOCKED and NOT
    RUN distinct. Record artifact identities, tests, retained controls and open
    defects. Commit qualified changes and update template provenance. Upload
    only authorized non-DEB artifacts; matching DEBs remain the user's upload.

## Current candidate evidence

The 2026-10-12 source comparison and installed findings are tracked in
[MSC122_DEV_INSTALLED_PARITY_20261012.md](evidence/MSC122_DEV_INSTALLED_PARITY_20261012.md).
The template's [numbered implementation plan](../../../myscoutee-template/guides/plans/MSC-122_TEMPLATE_IMPLEMENTATION_PLAN.md)
remains the implementation owner. This checklist does not mark that plan or
deployment qualification complete.

For Debian host ownership, verify `release-project.json.runtimeIdentity`, sysusers,
the production API image user, configuration/update/TLS file groups and restore
ownership together. Install on a host retaining the other project's account and
repeat configuration. Co-installation does not imply concurrent runtime support;
shared listening ports still require serial stack switching.
