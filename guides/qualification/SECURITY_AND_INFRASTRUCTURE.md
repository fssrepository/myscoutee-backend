# Security and infrastructure qualification

This campaign is separate from deployment and its UI smoke. It has its own
repeatable runners, measurements, findings and Excel ledger:
[SECURITY_AND_INFRASTRUCTURE.xlsx](SECURITY_AND_INFRASTRUCTURE.xlsx).
Raw redacted measurements live in [evidence](evidence/).

## Current scope — 2026-09-16

Target: VMware `192.168.153.129`, installed app QA2 monitor-r8, separate Go Registry.
External client: workstation; app via localhost HTTPS tunnel, Registry via its
published guest port. This does not prove public Internet perimeter protection.
Do not upgrade dependencies as routine maintenance during this campaign.

- `tools/qualification/security-probes.py`: finite unauthenticated negative probes
  and explicit port exposure checks; normal TLS verification is mandatory.
- `tools/qualification/measure-runtime.py`: idle working-set samples and explicitly
  requested warm service restart. Sampling is not an exact memory peak or cold boot.
- Findings remain open until repaired and retested; missing coverage stays NOT RUN.

## Resource efficiency

In this independently scheduled qualification campaign, investigate **resource efficiency**:
smaller memory footprint and less unnecessary CPU, I/O and startup work. Reuse
the already established E2E speedup evidence; this is not a repeat of that speed
comparison or a separate application-latency campaign. Record the installed
artifact, VM resources, Java runtime/version and service configuration so each
comparison uses the same workload and readiness definition.

- Measure time from service start to usable application readiness, including
  health checks and a successful rendered application request. Separate this
  from package installation time and identify slow startup phases/scripts.
- Record per-service/container memory at startup peak, idle readiness and during
  the UI smoke. Include JVM heap/non-heap and process/container memory where
  available; an allocated heap limit alone is not measured memory consumption.
- Inspect installation/startup scripts for repeated work, unnecessary waits,
  serial independent work and avoidable process or I/O overhead.
- Prefer changes that reduce resource waste while preserving the proven
  behavior. Report resource tradeoffs explicitly; a faster start achieved by
  substantially higher memory/CPU usage is not automatically more efficient.
- Consider a different supported Java runtime or JVM configuration when measured
  evidence justifies it. Compare startup, memory and smoke correctness against
  the retained baseline; do not replace the runtime merely on an assumption.
- Re-run readiness and the automated UI/media smoke after an optimization.
  Report before/after measurements, compatibility constraints and any remaining
  bottleneck in deployment qualification evidence, outside the pair-QA matrix.

This is a scoped deployment investigation, not authorization to change the
running QA stack or deploy a new runtime during an unrelated application test.

Include server-side code when profiling identifies substantial avoidable work,
such as repeated database reads, allocation pressure or redundant startup work.
Implement high-impact improvements supported by measurements, then compare the
same workload and verify affected behavior plus readiness/UI smoke. Keep each
change scoped to the measured cause; routine dependency upgrades remain under
the separate maintenance process above.

Record smaller, uncertain or deferred improvements in the candidate's table:

| Improvement / measured cause | Priority | Expected benefit and evidence | Effort / risk | Decision | Before / after |
| --- | --- | --- | --- | --- | --- |
| Populate from deployment measurements | Unassigned | Mark estimates separately from measurements | To assess | Pending investigation | NOT MEASURED |

Use P1 for substantial measured waste worth addressing in this qualification,
P2 for useful optional follow-up and P3 for low-impact work. Implement the P1
items within the qualified scope; retain P2/P3 items for later work rather than
expanding the release effort. A release-blocking correctness or security defect
is tracked as a blocker, not deferred as an optional optimization.

## External security

The user explicitly requests an adversarial security investigation of the
project's VMware production-mode deployment from outside the VM. Run against
the designated installed application origin and exposed services, using a
separate client. Record the client/network vantage point; access through a
workstation tunnel does not prove Internet-facing reachability or protection.

Include the separately deployed Go Registry in the same security qualification.
On VMware it emulates a remote service: the application and real Registry must
not share a Docker network; access crosses the published HTTPS endpoint. Verify
network membership, exposed ports, TLS trust/expiry, unauthenticated Registry
access, signature/replay rejection and separation from the internal Explore
`registry-demo`. Retain versioned fixtures and repeatable probes for both targets.

Use explicitly owned security fixture accounts and records to test unauthenticated access,
cross-account object access, role/admin authorization, session boundaries,
API input handling, upload/media access and file paths. Inspect exposed debug,
management and backup/configuration surfaces for unintended access or secret
disclosure. Verify transport and cookie/header behavior on the actual deployed
origin. Keep probes confined to the designated deployment and controlled data;
preserve unrelated users/uploads and service availability.

Retain reproducible requests and minimally necessary redacted evidence for each
finding. Repair confirmed leaks at their owning boundary and replay the failing
probe plus affected smoke steps. Record covered attack surfaces, findings,
fixes, retests and untested boundaries in the independent security ledger, outside
the pair-QA matrix. Do not describe a passing finite probe set as proof that no
vulnerability exists. This campaign is explicitly authorized now against the designated VMware guest.

