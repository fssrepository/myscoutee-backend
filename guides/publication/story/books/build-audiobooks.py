#!/usr/bin/env python3
"""Build speech-ready English audiobook packages from the locked manuscripts."""

from __future__ import annotations

import csv
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = next(candidate for candidate in Path(__file__).resolve().parents if (candidate / "frontend/src/assets/logo/heart.png").is_file())
MAX_CHUNK_CHARACTERS = 4_950
WORDS_PER_MINUTE = 150

VOICE_SETTINGS = {
    "displayName": "Jon — Warm & Grounded Storyteller",
    "voiceId": None,
    "model": "Eleven Multilingual v2",
    "modelId": "eleven_multilingual_v2",
    "modelVersion": None,
    "speed": 0.96,
    "stability": 65,
    "similarity": 60,
    "style": 0,
    "speakerBoost": False,
}

BOOKS = (
    {
        "part": "I",
        "slug": "01-the-city-between-us",
        "title": "The City Between Us",
        "source": "THE_CITY_BETWEEN_US_REVIEW_DRAFT_EN.md",
        "publishedPdf": "MyScoutee_The_Story_Part_I_The_City_Between_Us_v1.0.0_EN.pdf",
        "cover": "cover/MyScoutee_The_Story_Part_I_The_City_Between_Us_Audiobook_Cover.png",
        "master": "MyScoutee_The_Story_Part_I_The_City_Between_Us_Audiobook_Master_EN.txt",
        "prefix": "TCBU_1_EN",
        "productionPriority": 2,
    },
    {
        "part": "II",
        "slug": "02-the-system-between-us",
        "title": "The System Between Us",
        "source": "THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_EN.md",
        "publishedPdf": "MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_EN.pdf",
        "cover": "cover/MyScoutee_The_Story_Part_II_The_System_Between_Us_Audiobook_Cover.png",
        "master": "MyScoutee_The_Story_Part_II_The_System_Between_Us_Audiobook_Master_EN.txt",
        "prefix": "TSBU_2_EN",
        "productionPriority": 1,
        "initialGenerationBudgetCharacters": 30_607,
    },
)


@dataclass(frozen=True)
class SpokenBlock:
    text: str
    section: str
    is_heading: bool = False


@dataclass(frozen=True)
class Chunk:
    text: str
    section: str


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for data in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(data)
    return digest.hexdigest()


def count_words(text: str) -> int:
    return len(re.findall(r"\b[\w’'-]+\b", text, flags=re.UNICODE))


def ensure_pause(text: str) -> str:
    if not text:
        return text
    if text.endswith(('.', '!', '?', ':', ';', '…', '.”', '!”', '?”', '."', '!"', '?"')):
        return text
    return f"{text}."


def clean_spoken_text(text: str, *, heading: bool = False) -> str:
    text = re.sub(r"\[([^\]]+)]\(https?://[^)]+\)", r"\1", text)
    had_raw_url = bool(re.search(r"https?://\S+", text))
    text = re.sub(r"https?://\S+", "", text)
    text = text.replace("**", "").replace("*", "").replace("`", "")
    text = text.replace("©", "Copyright")
    text = re.sub(r"\s+", " ", text).strip()

    if not text:
        return ""
    if text.startswith("(") and text.endswith(")"):
        text = text[1:-1].strip()
    if text == "Sources:":
        return "Source links are listed in the accompanying print edition."
    if had_raw_url and text.endswith(":"):
        text = f"{text[:-1]}."
    return ensure_pause(text)


def join_wrapped_lines(lines: list[str]) -> str:
    joined = ""
    for raw_part in lines:
        part = raw_part.strip()
        if not part:
            continue
        if joined.endswith("-") and part[0].isalpha():
            joined += part
        elif joined:
            joined += f" {part}"
        else:
            joined = part
    return joined


def parse_manuscript(path: Path) -> list[SpokenBlock]:
    source = path.read_text(encoding="utf-8")
    source = re.sub(r"<!--.*?-->", "", source, flags=re.DOTALL)
    lines = source.splitlines()

    blocks: list[SpokenBlock] = []
    pending: list[str] = []
    pending_kind = "paragraph"
    current_section = "Front matter"

    def flush() -> None:
        nonlocal pending, pending_kind, current_section
        if not pending:
            return
        raw = join_wrapped_lines(pending)
        text = clean_spoken_text(raw, heading=pending_kind == "heading")
        pending = []
        if not text:
            return
        is_heading = pending_kind == "heading"
        if is_heading:
            current_section = text.rstrip(".")
        blocks.append(SpokenBlock(text=text, section=current_section, is_heading=is_heading))

    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped or re.fullmatch(r"[-_*]{3,}", stripped):
            flush()
            pending_kind = "paragraph"
            continue

        heading_match = re.match(r"^#{1,6}\s+(.+)$", stripped)
        if heading_match:
            flush()
            pending_kind = "heading"
            pending = [heading_match.group(1)]
            flush()
            pending_kind = "paragraph"
            continue

        if stripped.startswith("> "):
            quote_line = stripped[2:].strip()
            if current_section == "The City Between Us" or current_section == "Part II — The System Between Us":
                flush()
                text = clean_spoken_text(quote_line)
                if text:
                    blocks.append(
                        SpokenBlock(text=text, section=current_section, is_heading=False)
                    )
                pending_kind = "paragraph"
            else:
                if pending_kind != "quote":
                    flush()
                    pending_kind = "quote"
                pending.append(quote_line)
            continue

        if pending_kind == "quote":
            flush()
            pending_kind = "paragraph"

        list_match = re.match(r"^-\s+(.+)$", stripped)
        if list_match:
            flush()
            pending_kind = "list"
            pending = [list_match.group(1)]
            continue

        if pending_kind == "list" and (line.startswith("  ") or line.startswith("\t")):
            pending.append(stripped)
            continue

        if pending_kind == "list":
            flush()
            pending_kind = "paragraph"

        pending.append(stripped)

    flush()
    return blocks


def split_oversized_block(block: SpokenBlock) -> list[SpokenBlock]:
    if len(block.text) <= MAX_CHUNK_CHARACTERS:
        return [block]

    sentences = re.split(r"(?<=[.!?])\s+", block.text)
    pieces: list[str] = []
    current = ""
    for sentence in sentences:
        if not sentence:
            continue
        candidate = sentence if not current else f"{current} {sentence}"
        if len(candidate) <= MAX_CHUNK_CHARACTERS:
            current = candidate
            continue
        if current:
            pieces.append(current)
        current = sentence
        while len(current) > MAX_CHUNK_CHARACTERS:
            cut = current.rfind(" ", 0, MAX_CHUNK_CHARACTERS + 1)
            if cut < 1:
                cut = MAX_CHUNK_CHARACTERS
            pieces.append(current[:cut].strip())
            current = current[cut:].strip()
    if current:
        pieces.append(current)

    return [
        SpokenBlock(text=piece, section=block.section, is_heading=block.is_heading and index == 0)
        for index, piece in enumerate(pieces)
    ]


def make_chunks(blocks: list[SpokenBlock]) -> list[Chunk]:
    expanded = [piece for block in blocks for piece in split_oversized_block(block)]
    chunks: list[Chunk] = []
    current: list[SpokenBlock] = []

    def length_with(blocks_to_measure: list[SpokenBlock]) -> int:
        return len("\n\n".join(block.text for block in blocks_to_measure))

    def flush() -> None:
        nonlocal current
        if not current:
            return
        chunks.append(
            Chunk(
                text="\n\n".join(block.text for block in current),
                section=current[0].section,
            )
        )
        current = []

    for index, block in enumerate(expanded):
        if block.is_heading and current:
            heading_group = [block]
            if index + 1 < len(expanded) and not expanded[index + 1].is_heading:
                heading_group.append(expanded[index + 1])
            if length_with(current + heading_group) > MAX_CHUNK_CHARACTERS:
                flush()

        if current and length_with(current + [block]) > MAX_CHUNK_CHARACTERS:
            flush()
        current.append(block)
    flush()

    if any(len(chunk.text) > MAX_CHUNK_CHARACTERS for chunk in chunks):
        raise ValueError("Chunk limit exceeded")
    return chunks


def split_at_initial_budget(chunks: list[Chunk], budget: int | None) -> list[Chunk]:
    if not budget:
        return chunks

    result: list[Chunk] = []
    used = 0
    split_done = False
    for chunk in chunks:
        if split_done or used + len(chunk.text) <= budget:
            result.append(chunk)
            if not split_done:
                used += len(chunk.text)
            continue

        remaining_budget = budget - used
        paragraphs = chunk.text.split("\n\n")
        prefix: list[str] = []
        for paragraph in paragraphs:
            candidate = "\n\n".join(prefix + [paragraph])
            if len(candidate) > remaining_budget:
                break
            prefix.append(paragraph)

        if not prefix or len(prefix) == len(paragraphs):
            result.append(chunk)
            split_done = True
            continue

        result.append(Chunk(text="\n\n".join(prefix), section=chunk.section))
        result.append(Chunk(text="\n\n".join(paragraphs[len(prefix):]), section=chunk.section))
        split_done = True

    return result


def write_package(book: dict[str, str]) -> dict[str, object]:
    part_root = REPO_ROOT / "guides/publication/story/books/trilogy" / book["slug"]
    source_path = part_root / book["source"]
    pdf_path = part_root / book["publishedPdf"]
    package_root = part_root / "audiobook"
    cover_path = package_root / book["cover"]
    source_dir = package_root / "source"
    chunks_dir = package_root / "chunks"
    tracking_dir = package_root / "tracking"
    for directory in (source_dir, chunks_dir, tracking_dir):
        directory.mkdir(parents=True, exist_ok=True)

    blocks = parse_manuscript(source_path)
    master_text = "\n\n".join(block.text for block in blocks).strip() + "\n"
    master_path = source_dir / book["master"]
    master_path.write_text(master_text, encoding="utf-8")

    chunks = split_at_initial_budget(
        make_chunks(blocks),
        book.get("initialGenerationBudgetCharacters"),
    )
    for old_chunk in chunks_dir.glob("*.txt"):
        old_chunk.unlink()

    csv_path = tracking_dir / "CHUNK_MANIFEST.csv"
    existing_rows: dict[str, dict[str, str]] = {}
    if csv_path.exists():
        with csv_path.open(encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle):
                existing_rows[row["chunk_id"]] = row

    manifest_rows: list[dict[str, object]] = []
    total_generation_characters = 0
    total_words = 0
    for index, chunk in enumerate(chunks, start=1):
        chunk_id = f"{book['prefix']}_{index:03d}"
        filename = f"{chunk_id}.txt"
        chunk_path = chunks_dir / filename
        chunk_path.write_text(f"{chunk.text}\n", encoding="utf-8")
        characters = len(chunk.text)
        words = count_words(chunk.text)
        total_generation_characters += characters
        total_words += words
        existing = existing_rows.get(chunk_id, {})
        manifest_rows.append(
            {
                "sequence": index,
                "chunk_id": chunk_id,
                "text_file": f"chunks/{filename}",
                "expected_audio_file": f"{chunk_id}.mp3",
                "section_at_start": chunk.section,
                "characters": characters,
                "words": words,
                "estimated_minutes_at_150_wpm": f"{words / WORDS_PER_MINUTE:.2f}",
                "actual_duration_seconds": existing.get("actual_duration_seconds", ""),
                "audio_sha256": existing.get("audio_sha256", ""),
                "status": existing.get("status", "pending"),
            }
        )

    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=list(manifest_rows[0]),
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(manifest_rows)

    manifest = {
        "book": {
            "part": book["part"],
            "title": book["title"],
            "language": "en",
            "source": str(source_path.relative_to(REPO_ROOT)),
            "sourceSha256": sha256(source_path),
            "publishedPdf": str(pdf_path.relative_to(REPO_ROOT)),
            "publishedPdfSha256": sha256(pdf_path),
            "coverImage": str(cover_path.relative_to(REPO_ROOT)),
            "coverImageSha256": sha256(cover_path),
            "spokenMaster": str(master_path.relative_to(REPO_ROOT)),
            "spokenMasterSha256": sha256(master_path),
        },
        "adaptation": {
            "scope": "complete published text, including front matter and end notes",
            "removedFromSpeech": [
                "page-break and illustration markers",
                "Markdown formatting",
                "raw URL strings; named source labels remain",
            ],
            "rawUrlReplacement": "Source links are listed in the accompanying print edition.",
        },
        "voice": VOICE_SETTINGS,
        "generation": {
            "productionPriority": book["productionPriority"],
            "interface": "ElevenLabs Speech Synthesis website",
            "maximumCharactersPerWebsiteGeneration": 5_000,
            "packageMaximumCharactersPerChunk": MAX_CHUNK_CHARACTERS,
            "chunkCount": len(chunks),
            "generationCharacters": total_generation_characters,
            "estimatedCreditsAtOneTimesVoiceRate": total_generation_characters,
            "words": total_words,
            "estimatedMinutesAt150Wpm": round(total_words / WORDS_PER_MINUTE, 2),
            "audioFilenamePattern": f"{book['prefix']}_NNN.mp3",
        },
    }
    initial_budget = book.get("initialGenerationBudgetCharacters")
    if initial_budget:
        running_characters = 0
        included_chunks = 0
        for chunk in chunks:
            if running_characters + len(chunk.text) > initial_budget:
                break
            running_characters += len(chunk.text)
            included_chunks += 1
        manifest["generation"]["initialGenerationBudgetCharacters"] = initial_budget
        manifest["generation"]["initialBudgetChunkCount"] = included_chunks
        manifest["generation"]["initialBudgetUsedCharacters"] = running_characters
        manifest["generation"]["initialBudgetRemainingCharacters"] = initial_budget - running_characters
    json_path = tracking_dir / "AUDIOBOOK_MANIFEST.json"
    json_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    manifests = [write_package(book) for book in BOOKS]
    for manifest in manifests:
        book = manifest["book"]
        generation = manifest["generation"]
        print(
            f"Part {book['part']} — {book['title']}: "
            f"{generation['chunkCount']} chunks, "
            f"{generation['generationCharacters']} characters, "
            f"~{generation['estimatedMinutesAt150Wpm']} minutes"
        )


if __name__ == "__main__":
    main()
