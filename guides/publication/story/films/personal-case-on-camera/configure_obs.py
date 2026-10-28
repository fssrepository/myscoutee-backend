#!/usr/bin/env python3
"""Configure Pocket 3 / VAAPI recording and paired OBS profile/scene presets."""

import argparse
import json
import os
from pathlib import Path
import re
import shutil
from datetime import datetime


RENDER_NODE = "/dev/dri/by-path/pci-0000:00:02.0-render"
CAMERA = "/dev/video2"
WIDTH, HEIGHT, FPS = 3840, 2160, 30
PRESETS = (
    ("DJI Pocket 3 - 4K 16x9", "DJI_Pocket_3_4K_16x9", 3840, 2160),
    ("DJI Pocket 3 - 1080p 16x9", "DJI_Pocket_3_1080p_16x9", 1920, 1080),
    ("DJI Pocket 3 - 1080p 9x16", "DJI_Pocket_3_1080p_9x16", 1080, 1920),
)


def packed_pair(first: int, second: int) -> int:
    # OBS linux-v4l2 PACK64(a, b): high 32 bits = a, low 32 bits = b.
    return (first << 32) | second


def set_ini_section(text: str, section: str, values: dict[str, str]) -> str:
    match = re.search(rf"(?ms)^\[{re.escape(section)}\]\n.*?(?=^\[|\Z)", text)
    if match is None:
        raise ValueError(f"OBS profile section [{section}] is missing")
    body = match.group()
    for key, value in values.items():
        body, count = re.subn(rf"(?m)^{re.escape(key)}=.*$", f"{key}={value}", body)
        if count == 0:
            body = body.rstrip("\n") + f"\n{key}={value}\n\n"
        elif count != 1:
            raise ValueError(f"Duplicate OBS key: [{section}] {key}")
    return text[: match.start()] + body + text[match.end() :]


def one(items: list[dict], name: str) -> dict:
    found = [item for item in items if item.get("name") == name]
    if len(found) != 1:
        raise ValueError(f"Expected exactly one OBS source named {name!r}; found {len(found)}")
    return found[0]


def write_with_backup(path: Path, content: str) -> bool:
    if path.is_file() and path.read_text() == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
        backup = path.with_name(f"{path.name}.before-4k30-{stamp}")
        shutil.copy2(path, backup)
        print(f"Updated {path} (backup: {backup})")
    else:
        print(f"Created {path}")
    path.write_text(content)
    return True


def scene_for_size(scene: dict, width: int, height: int) -> dict:
    camera = one(scene.get("sources", []), "DJI")
    if camera.get("id") != "v4l2_input":
        raise ValueError("The DJI source is not an OBS V4L2 input")
    camera["settings"].update({
        "device_id": CAMERA,
        "input": 0,
        "pixelformat": int.from_bytes(b"MJPG", "little"),
        "resolution": packed_pair(width, height),
        "framerate": packed_pair(1, FPS),
    })
    obs_scene = one(scene["sources"], "Scene")
    scene_item = one(obs_scene["settings"].get("items", []), "DJI")
    scene_item.update({
        "pos": {"x": 0.0, "y": 0.0},
        "scale": {"x": 1.0, "y": 1.0},
        "crop_left": 0, "crop_right": 0, "crop_top": 0, "crop_bottom": 0,
    })
    scene["resolution"] = {"x": width, "y": height}
    return scene


def profile_for_size(ini: str, width: int, height: int) -> str:
    return set_ini_section(ini, "Video", {
        "BaseCX": str(width), "BaseCY": str(height),
        "OutputCX": str(width), "OutputCY": str(height),
    })


def main() -> None:
    default_config = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config")) / "obs-studio"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config-dir", type=Path, default=default_config,
                        help="OBS configuration directory (default: XDG_CONFIG_HOME/obs-studio)")
    parser.add_argument("--microphone", required=True,
                        help="PulseAudio source name of the DJI Pocket 3 microphone")
    parser.add_argument("--presets-only", action="store_true",
                        help="Create/update named presets without writing the active Untitled files")
    args = parser.parse_args()
    root = args.config_dir / "basic"
    ini_path = root / "profiles/Untitled/basic.ini"
    encoder_path = root / "profiles/Untitled/recordEncoder.json"
    scene_path = root / "scenes/Untitled.json"
    for path in (ini_path, encoder_path, scene_path):
        if not path.is_file():
            parser.error(f"Required existing OBS file is missing: {path}")

    ini = ini_path.read_text()
    ini = set_ini_section(ini, "Output", {"Mode": "Advanced"})
    ini = set_ini_section(ini, "AdvOut", {
        "RecEncoder": "ffmpeg_vaapi_tex",
        "RecType": "Standard",
        "RecFormat2": "mp4",
        "RecUseRescale": "false",
        "RecTracks": "1",
        "Track1Bitrate": "160",
        "RecAudioEncoder": "libfdk_aac",
    })
    ini = profile_for_size(ini, WIDTH, HEIGHT)
    ini = set_ini_section(ini, "Video", {
        "FPSType": "0", "FPSCommon": str(FPS),
        "ColorFormat": "NV12", "ColorSpace": "709", "ColorRange": "Partial",
    })
    ini = set_ini_section(ini, "Audio", {"SampleRate": "48000"})

    encoder = json.loads(encoder_path.read_text())
    encoder.update({"vaapi_device": RENDER_NODE, "rate_control": "CBR", "bitrate": 20000})
    encoder_text = json.dumps(encoder, ensure_ascii=False, separators=(",", ":"))

    scene = scene_for_size(json.loads(scene_path.read_text()), WIDTH, HEIGHT)
    microphone = scene.get("AuxAudioDevice1")
    if not microphone or microphone.get("id") != "pulse_input_capture":
        raise ValueError("Expected the existing PulseAudio Mic/Aux source")
    microphone["settings"]["device_id"] = args.microphone
    microphone["muted"] = False
    scene_text = json.dumps(scene, ensure_ascii=False, separators=(",", ":"))

    pending = [] if args.presets_only else [
        (ini_path, ini), (encoder_path, encoder_text), (scene_path, scene_text)
    ]
    for name, slug, width, height in PRESETS:
        preset_ini_path = root / "profiles" / slug / "basic.ini"
        preset_scene_path = root / "scenes" / f"{slug}.json"
        if preset_ini_path.exists() and f"Name={name}\n" not in preset_ini_path.read_text():
            raise ValueError(f"Different OBS profile already uses {preset_ini_path}")
        if preset_scene_path.exists() and json.loads(preset_scene_path.read_text()).get("name") != name:
            raise ValueError(f"Different scene collection already uses {preset_scene_path}")
        preset_ini = set_ini_section(profile_for_size(ini, width, height), "General", {"Name": name})
        preset_scene = scene_for_size(json.loads(scene_text), width, height)
        preset_scene["name"] = name
        pending.extend((
            (preset_ini_path, preset_ini),
            (root / "profiles" / slug / "recordEncoder.json", encoder_text),
            (preset_scene_path, json.dumps(preset_scene, ensure_ascii=False, separators=(",", ":"))),
        ))

    # Validate every source and destination before writing any file.
    for path, content in pending:
        write_with_backup(path, content)
    print("OBS DJI/VAAPI 4K and 1080p presets are ready. Restart OBS to load them.")


if __name__ == "__main__":
    main()
