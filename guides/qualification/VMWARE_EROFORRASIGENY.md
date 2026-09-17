# MyScoutee — VMware resource usage and Aruba server sizing

Updated: **17 September 2026**. This document combines read-only measurements
from the running VMware guest, a provisional Aruba sizing recommendation,
and the figures reported in the previous day's Codex session.

**Suggested starting configuration for low traffic: 2 vCPU, 4 GB RAM,
40 GB SSD/NVMe, Ubuntu Server LTS, amd64/x86_64.** This is a sizing estimate;
installation and representative load testing on a 4 GB target remain unverified.

## Current measurements — 17 September 2026

The guest runs **Ubuntu 26.04 LTS**, **MyScoutee 1.0.0**, and **9 healthy
containers** on **2 vCPU**. VMware exposes an Intel Core i5-1335U CPU;
its performance is not necessarily equivalent to an Aruba vCPU.

Two sampling windows, each approximately 31 seconds with six samples, were
recorded at **19:36 and 19:37 Europe/Bratislava**. The VM had just booted;
the second window started approximately two minutes after boot. No synthetic
workload, build, installation, or service restart was performed.

| Measurement | Result |
| --- | ---: |
| Guest CPU usage, first / second window average | 12.8% / 12.4% |
| Guest CPU usage, range across both windows | 9.4–15.4% |
| All 9 containers, combined memory | 1.46–1.47 GiB |
| Java API, first window | approximately 604–606 MiB |
| MongoDB, first window | approximately 428 MiB |
| MinIO, first window | approximately 334 MiB |
| Guest memory visible to Linux (`MemTotal`) | 5.24 GiB |
| Guest available memory, second window (`MemAvailable`) | 3.57–3.66 GiB |
| Whole guest memory usage estimate, second window | **1.58–1.66 GiB** |
| Swap | none |
| Virtual disk capacity | 20 GiB (21.47 GB) |
| Root filesystem: size / used / available | 17.83 / 11.01 / 5.95 GiB |

### Does 1.47 GiB include Ubuntu?

**No. The 1.47 GiB figure is the combined Docker container working set.**
The whole guest, including Ubuntu and Docker, currently uses approximately
**1.58–1.66 GiB**, estimated as `MemTotal - MemAvailable` in the second window.
These values are nested, so they must not be added together.

The difference is roughly 0.1–0.2 GiB in these samples, but it is not a precise
standalone measurement of Ubuntu: Docker working-set accounting and Linux's
available-memory estimate treat reclaimable cache differently.

The running VM's `.vmx` configuration confirms **6144 MiB (6 GiB)** assigned
RAM. Linux reports **5.24 GiB** in `/proc/meminfo` after reservations. The
kernel log and `/sys/kernel/kexec_crash_size` confirm a **512 MiB crash-kernel
reservation**, used for crash diagnostics. Other kernel/platform reservations
account for the remaining difference; their individual breakdown was not
measured. This reserved capacity is separate from application consumption.

At 19:41 Europe/Bratislava, `free -b` reported these rounded values:

| `free` column | Value |
| --- | ---: |
| `total` | 5.24 GiB |
| `used` | 1.48 GiB |
| `free` | 2.28 GiB |
| `buff/cache` | 1.73 GiB |
| `available` | 3.76 GiB |

Consequently, `free + used` is only about **3.76 GiB**, not the VM's assigned
6 GiB. Cache is shown separately, and this version's `used` equals
`total - available`: `used + free + buff/cache` is also not an exact accounting
identity. `available` estimates memory that applications can obtain, including
reclaimable cache. The useful comparison is **1.48 GiB used versus 3.76 GiB
available**, within the **5.24 GiB Linux total**. Cache is not lost memory.
No crash-kernel or other memory settings were changed.

### CPU and disk interpretation

CPU usage was calculated from differences in `/proc/stat`, normalized across
both vCPUs: 100% means both are fully occupied. The measured average is roughly
**0.25 fully occupied vCPU**. Background tasks and measurement overhead are
included. These short windows do not establish peak or loaded performance.

Selected disk usage: `/opt/myscoutee` **0.77 GiB**,
`/var/lib/myscoutee` **0.36 GiB**, `/var/lib/containerd` **5.12 GiB**.
Docker reports 44 image entries, of which 8 are active; retained older images
may contribute to disk usage. No cleanup was performed.

The **11.01 GiB** figure covers the entire root filesystem, including Ubuntu,
packages, container images, application data, and logs. It excludes the separate
`/boot` filesystem and is not an application-only disk requirement. Host-side
VMware disk files and snapshots were not measured.

## Aruba recommendation

The **Aruba Cloud VPS OpenStack O2A4** plan provides **2 vCPU, 4 GB RAM,
40 GB NVMe storage, and a public IPv4 address**. On 17 September 2026,
the Hungarian Linux listing shows **HUF 2,600 + VAT/month**, or
**HUF 3,302/month including VAT**. Source: [Aruba Cloud VPS plans and pricing](https://www.arubacloud.hu/virtualis-privat-szerver-ajanlat-tipusok.aspx).

| Resource | Reason for the starting recommendation |
| --- | --- |
| 2 vCPU | The observed CPU usage does not justify 4 vCPU initially. Two allow more room for concurrent requests and background work than one. |
| 4 GB RAM | Provides headroom over the observed 1.58–1.66 GiB whole-guest estimate. A 2 GB plan leaves little room for startup, cache growth, and concurrent work; these measurements do not establish a need for 8 GB. |
| 40 GB storage | Leaves room beyond the current installation for updates, logs, and initial user data. Uploaded media and retained backups determine future storage needs. |
| Ubuntu Server LTS, amd64/x86_64 | Use a server installation without a desktop. The current release package targets amd64; installation on the selected Aruba Ubuntu image still needs verification. |

This recommendation assumes deployment of a prebuilt release and initially
low traffic. It does not budget for running development builds on the VPS.
The measured stack includes the separate Go Registry and its nginx, the
internal demo Registry, and the payment simulator.

Neither a supported concurrent-user count nor the startup memory peak has
been established. Confirm the estimate on the 4 GB target under representative
usage before relying on it for a larger audience.

### Does Aruba also lose 512 MiB to crash diagnostics?

Not necessarily. The measured 512 MiB is this Ubuntu guest's `kdump`
reservation, not a fixed VMware or Aruba overhead. On a 4 GiB machine,
512 MiB would consume **12.5%** of assigned RAM before application use.
The earlier whole-guest usage estimate excludes this reserved memory because
it is already excluded from Linux's `MemTotal`.

Ubuntu's documented automatic-enablement conditions include at least four
CPU threads and 6 GB RAM. A fresh 2 vCPU / 4 GB installation does not meet
those conditions, but a provider's preconfigured image can differ. Inspect
`/proc/cmdline`, `/sys/kernel/kexec_crash_size`, and `free -h` on the actual
Aruba instance rather than subtracting 512 MiB automatically.

Kdump can be disabled if kernel-crash memory dumps are not required; removing
the boot reservation takes effect after the relevant boot configuration is
updated and the machine is rebooted. The tradeoff is losing those diagnostic
dumps. No such change was made here. Source: [Ubuntu kernel crash dump documentation](https://ubuntu.com/server/docs/how-to/software/kernel-crash-dump/).

### Google Cloud cost comparison

Illustrative on-demand Linux pricing checked on 17 September 2026, using
**Iowa (`us-central1`), 730 hours/month, 40 GiB zonal balanced Persistent Disk,
and one in-use external IPv4 address**. These are US-region examples, not a
Frankfurt quote. Excludes tax, outbound traffic, snapshots, extra services,
trial credits, and commitment discounts.

| Configuration | VM/month | Disk/month | IPv4/month | Total/month |
| --- | ---: | ---: | ---: | ---: |
| E2 medium, 4 GiB, shared CPU | USD 24.46 | USD 4.00 | USD 3.65 | **USD 32.11** |
| E2 custom, 2 vCPU / 4 GiB | USD 42.40 | USD 4.00 | USD 3.65 | **USD 50.05** |

Calculation inputs: E2 medium USD 0.03350571/hour; E2 custom
USD 0.02290217/vCPU-hour plus USD 0.003069707/GiB-hour;
balanced disk USD 0.000136986/GiB-hour; IPv4 USD 0.005/hour
(the one free IPv4 hour per account/month changes rounding by at most a cent).
Sources: [Google VM prices](https://cloud.google.com/products/compute/pricing/general-purpose),
[disk prices](https://cloud.google.com/compute/disks-image-pricing),
and [network/IPv4 prices](https://cloud.google.com/vpc/network-pricing).

E2 medium exposes two vCPUs but sustains only one vCPU-equivalent in total,
with temporary bursting, so it is not equivalent to two full vCPUs.
See [Google E2 CPU allocation](https://docs.cloud.google.com/compute/docs/general-purpose-machines#shared-core).
The Aruba plan's HUF 2,600/month before VAT includes its storage, IPv4, and
25 TB/month traffic allowance. For this single-server deployment, Aruba is
the lower-cost starting option; price the intended European Google region
and expected outbound traffic separately if choosing Google Cloud.

## Previous session figures — 16 September 2026

The earlier measurement used **MyScoutee 1.0.0~qa.3**, 2 vCPU, and three short
idle samples, recorded at approximately **22:23–22:25 Europe/Bratislava**.

| Measurement | Previous result |
| --- | ---: |
| All 9 containers, combined memory | 1.07 GiB |
| Java API / MongoDB / MinIO | 645 / 248 / 146 MiB |
| Redis / application nginx / demo Registry | approximately 13 / 10 / 11 MiB |
| Payment simulator / separate Go Registry / Registry nginx | approximately 5.5 / 15 / 5.6 MiB |
| Guest total / available memory | 5.24 / 2.40 GiB |
| Root filesystem: size / used / available (`df -h`, rounded) | 18 / 11 / 6.8 GiB |

The conversation described a “20 GB” virtual disk and a root filesystem that
initially occupied only about 10 GB, with about 1.1 GB available and 8.2 GB
unallocated in the volume group. The evening evidence shows the expanded root
filesystem. Today's byte-level measurement identifies the virtual disk's exact
capacity as 20 GiB.

These are historical measurements of a different release and runtime state,
not proof of a memory regression or of an application's minimum requirements.

## Evidence

- [Current CPU, memory, disk, and follow-up samples](evidence/vmware-resources-20260917.json)
- [Previous container memory, guest memory, and CPU count](evidence/runtime-current-20260916-2225.json)
- [Previous filesystem and container health](evidence/details-current-20260916-2225.json)
- [Previous JVM and MongoDB memory diagnostics](evidence/memory-current-20260916-2225.json)
- [Infrastructure qualification record](SECURITY_AND_INFRASTRUCTURE.md)
- Previous Codex session: `01a0a44c-3c08-7fb1-876d-dd0b847da3aa`;
  16 September 2026, 13:33–13:34 (virtual disk and partition discussion)
  and 22:28 (memory summary), Europe/Bratislava time.

Memory and filesystem measurements use binary MiB/GiB. Aruba plan sizes above
retain the provider's GB labels.
