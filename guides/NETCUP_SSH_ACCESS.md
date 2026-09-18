# Netcup server: SSH access

Operator guide. Last verified: **2026-09-18**.

Installation progress and current deployment state:
[Netcup deployment](NETCUP_DEPLOYMENT.md).

## Connection details

| Setting | Value |
| --- | --- |
| Server | `v2202609421826523729` |
| Provider / location | Netcup, Vienna |
| Product | RS 1000 G12 ip iv |
| IPv4 address | `62.83.35.187` |
| Provider hostname | `v2202609421826523729.quicksrv.de` |
| SSH port | `22` |
| Login user | `root` |
| Verified authentication | Password |
| Installed OS | Debian 13 (trixie) minimal, AMD64 |

Use the IP address directly; the `myscoutee.com` DNS configuration is not
required for SSH access.

## Connect from a terminal

```bash
ssh -o HostKeyAlgorithms=ssh-ed25519 -o StrictHostKeyChecking=ask root@62.83.35.187
```

On the first connection, compare the displayed ED25519 host fingerprint with:

```text
SHA256:K/AtYia1UftkE1nRCOIrE4junGAHw6n0+lQUjCYaaZk
```

This fingerprint was matched against the Netcup provisioning email and the
live server on 2026-09-18. Enter `yes` only if it matches. OpenSSH then stores
the public host key in the local user's `~/.ssh/known_hosts` file. If it differs
or SSH reports a changed host key, verify the change through Netcup before
continuing; do not bypass the check.

Enter the current root password at the password prompt. The initial password
was supplied in the email titled **“Ihr vServer bei netcup ist bereitgestellt”**,
received on 2026-09-18 at 13:20. After a password change, use the replacement
password. Passwords and private keys must not be stored in this repository or
included in command-line arguments.

End the session with:

```bash
exit
```

## Read-only system checks after login

```bash
cat /etc/os-release
uname -m
free -m
df -h /
uptime
```

## Verified state and continuation

The initial test used Python Paramiko with the ED25519 fingerprint explicitly
pinned before password authentication. Root login and the system queries
succeeded. That test did not add an OpenSSH `known_hosts` entry, install an SSH
key, change the password, configure a tunnel, or install application software.
The terminal command above is the equivalent interactive access procedure.

Baseline before Docker / MyScoutee installation:

| Measurement | Observed value |
| --- | --- |
| RAM reported by `free -m` | 7,945 MiB total; 315 MiB used; 7,629 MiB available |
| Swap | None |
| CPU | 4 vCPUs; AMD EPYC 9645 reported by the guest |
| Load average | 0.00 / 0.00 / 0.00 |
| Root filesystem | 251 GiB total; 931 MiB used; 240 GiB available (`df -h`) |

These are initial idle measurements, not application load-test results.
For a later session, start with this guide and the deployment record linked
above, then recheck the live state. SSH key authentication has not been
configured by this workflow; application installation continued after this
initial connection test.
