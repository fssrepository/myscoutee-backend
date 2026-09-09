#!/usr/bin/env python3
"""Propagate verified mentions across the prompt pack; never contact Higgsfield."""
import argparse
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "04_tracking/source_manifest.json"
WARNING = re.compile(r"\AREFERENCE SETUP INCOMPLETE: [^\n]+\nDo not generate until these references are bound\.\n\n")
TOKEN = re.compile(r"(?<![\w@])@[A-Za-z0-9_][A-Za-z0-9_-]*")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Update mentions, readiness notices and hashes in place.")
    parser.add_argument("--check", help="Check one prompt path relative to cinema_studio_steps; no writes.")
    args = parser.parse_args()
    if args.write and args.check:
        parser.error("Choose --write or --check.")
    manifest = json.loads(MANIFEST.read_text())
    bindings = manifest["reference_bindings"]
    replacements = {}
    wanted = {}
    owners = {}
    for key, binding in bindings.items():
        mention = binding["mention"]
        if mention and (not TOKEN.fullmatch(mention) or mention.startswith("@UNBOUND_")):
            raise ValueError(f"Invalid verified mention for {key}: {mention}")
        if mention in owners:
            raise ValueError(f"Mention shared by distinct assets {owners[mention]} and {key}: {mention}")
        if mention:
            owners[mention] = key
        wanted[key] = mention or f"@UNBOUND_{key}"
        for old in ("@" + binding["alias"], f"@UNBOUND_{key}", binding.get("last_mention"), mention):
            if old:
                if old in replacements and replacements[old] != wanted[key]:
                    raise ValueError(f"Ambiguous mention: {old}")
                replacements[old] = wanted[key]

    prompts = {a["path"]: a.get("refs", []) for a in manifest["assets"].values()}
    prompts.update({p["file"]: p.get("refs", []) for p in manifest["pilot_files"]})
    if args.check and args.check not in prompts:
        parser.error("--check must name a prompt listed in source_manifest.json")
    planned = {}
    missing_by_file = {}
    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT).as_posix()
        if path.suffix not in (".txt", ".md") or relative.startswith("04_tracking/"):
            continue
        original = path.read_text()
        result = TOKEN.sub(lambda m: replacements.get(m[0], m[0]), original)
        if relative in prompts:
            result = WARNING.sub("", result)
            tokens = set(TOKEN.findall(result))
            unknown_dependencies = [key for key in prompts[relative] if key not in wanted and not re.fullmatch(r"V\d+", key)]
            if unknown_dependencies:
                raise ValueError(f"Dependencies missing from binding registry in {relative}: {unknown_dependencies}")
            expected = {wanted[key] for key in prompts[relative] if key in wanted}
            if expected - tokens:
                raise ValueError(f"Missing dependency mentions in {relative}: {sorted(expected - tokens)}")
            if tokens - set(wanted.values()):
                raise ValueError(f"Unknown reference mentions in {relative}: {sorted(tokens - set(wanted.values()))}")
            missing = sorted(t.removeprefix("@UNBOUND_") for t in tokens if t.startswith("@UNBOUND_"))
            if missing:
                missing_by_file[relative] = missing
                result = f"REFERENCE SETUP INCOMPLETE: {', '.join(missing)}\nDo not generate until these references are bound.\n\n" + result
        if original != result:
            planned[path] = result

    if args.write:
        for path, result in planned.items():
            path.write_text(result)
        for key, binding in bindings.items():
            binding["last_mention"] = wanted[key]
        for entry in manifest["prompts"]:
            entry["file_sha256"] = hashlib.sha256((ROOT / entry["file"]).read_bytes()).hexdigest()
        for entry in manifest["pilot_files"]:
            entry["sha256"] = hashlib.sha256((ROOT / entry["file"]).read_bytes()).hexdigest()
        updated = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
        if MANIFEST.read_text() != updated:
            MANIFEST.write_text(updated)
        print(f"Updated {len(planned)} files. {sum(bool(b['mention']) for b in bindings.values())}/{len(bindings)} reference mentions verified.")
    if args.check:
        missing = missing_by_file.get(args.check, [])
        stale = any(p.relative_to(ROOT).as_posix() == args.check for p in planned)
        status = "MISSING " + ", ".join(missing) if missing else ("Bindings available; run --write to synchronize this prompt." if stale else "All required mentions are bound; media availability and UI autoload still depend on Higgsfield.")
        print(f"{args.check}: {status}")
        return 2 if missing or stale else 0
    print(f"{len(prompts) - len(missing_by_file)}/{len(prompts)} prompts have no unresolved mention slots.")
    return 0 if args.write else (2 if missing_by_file or planned else 0)


if __name__ == "__main__":
    raise SystemExit(main())
