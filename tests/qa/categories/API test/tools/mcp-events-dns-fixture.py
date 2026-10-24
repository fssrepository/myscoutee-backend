#!/usr/bin/env python3
"""Scoped callback DNS faults in the existing monolith container; never starts it."""
import argparse
import ipaddress
import re
import subprocess

MARKER = "# MSC116-MCP-EVENTS-DNS"


def run(*args, data=None):
    return subprocess.run(["docker", "exec", "-u", "0", "-i", "myscoutee", *args],
                          input=data, text=True, check=True, capture_output=True).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["stage", "clear"])
    parser.add_argument("--host")
    parser.add_argument("--address", action="append", default=[])
    args = parser.parse_args()
    if args.action == "stage":
        if not args.host or not re.fullmatch(r"(?:[a-z0-9-]+\.trycloudflare\.com|msc116-[a-z0-9-]+\.invalid)", args.host):
            parser.error("Only a disposable callback tunnel or MSC116 test hostname is allowed")
        if not 1 <= len(args.address) <= 4:
            parser.error("Provide one to four controlled addresses")
        addresses = [str(ipaddress.ip_address(value)) for value in args.address]
    original = run("cat", "/etc/hosts")
    retained = [line for line in original.splitlines() if not line.endswith(MARKER)]
    if args.action == "stage":
        if any(args.host in line.split("#", 1)[0].split()[1:] for line in retained):
            parser.error("Refusing to replace an existing host entry")
        retained.extend(f"{address}\t{args.host}\t{MARKER}" for address in addresses)
    updated = "\n".join(retained) + "\n"
    # /etc/hosts is a Docker bind mount: write in place, not rename. Unrelated
    # entries are preserved; clear removes only this fixture's marked lines.
    run("sh", "-c", "cat > /etc/hosts", data=updated)
    if run("cat", "/etc/hosts") != updated:
        raise RuntimeError("DNS fixture write did not verify")
    print(f"DNS fixture {args.action}: {len(args.address) if args.action == 'stage' else 0} marked addresses")


if __name__ == "__main__":
    main()
