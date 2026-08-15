#!/usr/bin/env python3
"""Package a rendered MyScoutee book as a validated, reflowable EPUB 3 file."""

from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import re
import subprocess
import tempfile
import uuid
import zipfile
from datetime import date
from pathlib import Path
from xml.etree import ElementTree


IMAGE_TYPES = {
    "image/jpeg": ("jpg", "image/jpeg"),
    "image/png": ("png", "image/png"),
    "image/svg+xml": ("svg", "image/svg+xml"),
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_published_pdf(
    pdf_path: Path,
    version: dict[str, object],
    metadata: dict[str, object],
) -> str:
    """Bind the EPUB cover to an already verified public PDF edition."""
    if not pdf_path.is_file():
        raise FileNotFoundError(f"Published cover source is missing: {pdf_path}")
    checksum_path = pdf_path.with_suffix(f"{pdf_path.suffix}.sha256")
    manifest_path = pdf_path.with_suffix(".publication.json")
    if not checksum_path.is_file() or not manifest_path.is_file():
        raise FileNotFoundError(
            f"Published PDF integrity files are incomplete for {pdf_path.name}"
        )

    checksum_parts = checksum_path.read_text(encoding="utf-8").strip().split(maxsplit=1)
    if len(checksum_parts) != 2:
        raise ValueError(f"Malformed checksum file: {checksum_path}")
    expected_digest, expected_name = checksum_parts
    if expected_name.lstrip("*") != pdf_path.name:
        raise ValueError(f"Checksum filename mismatch: {checksum_path}")
    digest = sha256_file(pdf_path)
    if digest != expected_digest:
        raise ValueError(f"Published PDF checksum mismatch: {pdf_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    expected_values = {
        "file": pdf_path.name,
        "sha256": digest,
        "part": version["trilogy_part"],
        "part_roman": version["trilogy_roman"],
        "edition_version": version["version"],
        "published": version["published"],
        "metadata": metadata,
    }
    for key, expected in expected_values.items():
        if manifest.get(key) != expected:
            raise ValueError(
                f"Published PDF manifest mismatch for '{key}': {manifest_path}"
            )
    return digest


def render_cover(pdf_path: Path) -> bytes:
    """Rasterize the localized published cover at roughly 1800x2700 pixels."""
    with tempfile.TemporaryDirectory(prefix="myscoutee-epub-cover-") as temp_name:
        prefix = Path(temp_name) / "cover"
        result = subprocess.run(
            [
                "pdftoppm",
                "-f",
                "1",
                "-l",
                "1",
                "-singlefile",
                "-r",
                "300",
                "-jpeg",
                str(pdf_path),
                str(prefix),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(
                f"Could not rasterize EPUB cover from {pdf_path}: {result.stderr.strip()}"
            )
        cover_path = prefix.with_suffix(".jpg")
        if not cover_path.is_file():
            raise RuntimeError(f"pdftoppm did not create a cover for {pdf_path}")
        cover = cover_path.read_bytes()

    from PIL import Image

    with Image.open(io.BytesIO(cover)) as image:
        if image.width < 1600 or image.height < 2500:
            raise ValueError(f"EPUB cover is too small: {image.width}x{image.height}")
        ratio = image.width / image.height
        if ratio < 0.53 or ratio > 0.70:
            raise ValueError(
                f"EPUB cover has an unexpected ratio: {image.width}x{image.height}"
            )
    if len(cover) > 5 * 1024 * 1024:
        raise ValueError(f"EPUB cover exceeds 5 MiB: {len(cover)} bytes")
    return cover


def optimize_image(mime: str, payload: bytes) -> tuple[str, str, bytes]:
    """Keep vectors/transparency and compress opaque illustration PNGs as JPEG."""
    if mime not in IMAGE_TYPES:
        raise ValueError(f"Unsupported embedded image type: {mime}")
    extension, media_type = IMAGE_TYPES[mime]
    if mime != "image/png":
        return extension, media_type, payload

    from PIL import Image

    with Image.open(io.BytesIO(payload)) as image:
        image.load()
        if "A" in image.getbands() and image.getchannel("A").getextrema() != (255, 255):
            return extension, media_type, payload
        rgb = image.convert("RGB")
        if rgb.width > 1800:
            height = round(rgb.height * 1800 / rgb.width)
            rgb = rgb.resize((1800, height), Image.Resampling.LANCZOS)
        target = io.BytesIO()
        rgb.save(
            target,
            format="JPEG",
            quality=90,
            optimize=True,
            progressive=False,
            subsampling=1,
        )
        optimized = target.getvalue()
    if len(optimized) >= len(payload):
        return extension, media_type, payload
    return "jpg", "image/jpeg", optimized


def link_visible_urls(fragment: str, language: str) -> str:
    """Keep source URLs clickable without feeding path fragments to spellcheck."""
    label = "Forrás" if language == "hu" else "Source"
    pattern = re.compile(r"https?://[^\s<]+")
    pieces = re.split(r"(<[^>]+>)", fragment)
    for index, piece in enumerate(pieces):
        if piece.startswith("<"):
            continue

        def replace(match: re.Match[str]) -> str:
            url = match.group(0)
            trailing = ""
            while url and url[-1] in ".,;:":
                trailing = url[-1] + trailing
                url = url[:-1]
            return f'<a href="{url}">{label}</a>{trailing}'

        pieces[index] = pattern.sub(replace, piece)
    return "".join(pieces)


def normalize_body(document: str, language: str) -> str:
    """Remove print-only cover mechanics and make the body valid reflowable XHTML."""
    try:
        body = document.split("<body>", 1)[1].rsplit("</body>", 1)[0]
    except IndexError as exc:
        raise ValueError("Rendered book document has no complete body") from exc

    body, cover_count = re.subn(
        r'\s*<section class="cover"[^>]*>.*?</section>',
        "",
        body,
        count=1,
        flags=re.DOTALL,
    )
    if cover_count != 1:
        raise ValueError("Could not remove the print cover before EPUB packaging")

    body = re.sub(
        r'<div class="brand-lockup"([^>]*)>.*?</div>',
        r'<div class="brand-lockup"\1><span>MyScoutee</span></div>',
        body,
        flags=re.DOTALL,
    )
    body = re.sub(
        r'<p><span class="drop-cap ([^"]+)">([^<])</span>',
        r'<p class="drop-cap \1">\2',
        body,
    )
    if '<span class="drop-cap ' in body:
        raise ValueError("EPUB still contains split drop-cap words")

    if language == "en":
        replacements = {
            "tourism-security officers": "officers assigned to tourism security",
            "an unnamed friendship-centred event community": (
                "an unnamed event community centred on friendship"
            ),
            "a friendship-centred room": "a room centred on friendship",
            "The unnamed friendship-centred community": (
                "The unnamed community centred on friendship"
            ),
        }
        for old, new in replacements.items():
            body = body.replace(old, new)

    body = link_visible_urls(body, language)
    body = body.replace(
        '<section class="title-page">',
        '<section epub:type="titlepage" class="title-page">',
        1,
    )
    body = body.replace(
        '<section class="dedication-page"',
        '<section epub:type="dedication" class="dedication-page"',
        1,
    )
    return re.sub(
        r'<(img|hr|br)(\b[^>]*?)(?<!/)>',
        r'<\1\2 />',
        body.strip(),
    )


def extract_images(fragment: str) -> tuple[str, dict[str, tuple[str, bytes]]]:
    assets: dict[str, tuple[str, bytes]] = {}
    pattern = re.compile(r'src="data:([^;"]+);base64,([^"]+)"')

    def replace(match: re.Match[str]) -> str:
        mime = match.group(1)
        payload = base64.b64decode(match.group(2), validate=True)
        extension, media_type, payload = optimize_image(mime, payload)
        digest = hashlib.sha256(payload).hexdigest()
        filename = f"asset-{digest[:20]}.{extension}"
        previous = assets.get(filename)
        if previous is not None and previous != (media_type, payload):
            raise ValueError(f"EPUB asset digest collision: {filename}")
        assets[filename] = (media_type, payload)
        return f'src="images/{filename}"'

    return pattern.sub(replace, fragment), assets


def stylesheet() -> str:
    return """@charset "utf-8";
body { color: #192534; font-family: Georgia, "Times New Roman", serif; font-size: 1em; line-height: 1.55; margin: 0 auto; max-width: 42em; padding: 0 4%; }
a { color: #2759a8; overflow-wrap: anywhere; }
h1, h2, h3 { break-after: avoid; color: #17243a; line-height: 1.18; }
h1 { font-size: 1.75em; margin: 2em 0 1em; }
h2 { border-bottom: .08em solid #c9a45a; font-size: 1.45em; margin: 2em 0 .8em; padding-bottom: .25em; }
h3 { color: #315c7b; font-size: 1.12em; margin-top: 1.6em; }
p { margin: 0 0 1em; orphans: 2; widows: 2; }
blockquote { border-left: .25em solid #c95f50; margin: 1.4em 1em; padding: .5em 1em; }
blockquote p { margin: 0; }
ul { margin: .8em 0 1.2em; }
li { margin-bottom: .35em; }
hr { border: 0; border-top: .08em solid #d9cdbb; margin: 1.8em 0; }
img { height: auto; max-width: 100%; }
figcaption { color: #687384; font-size: .82em; font-style: italic; margin-top: .45em; }
.brand-lockup { color: #315c7b; font-family: Arial, sans-serif; font-size: 1.2em; font-weight: bold; }
.title-page, .dedication-page { break-after: page; min-height: 70vh; padding-top: 18%; text-align: center; }
.title-page .volume-roman { display: block; font-size: 3em; }
.title-page .volume-copy, .title-page .edition, .title-page .truth { color: #687384; display: block; }
.toc { break-after: page; }
.toc ol { list-style: none; padding: 0; }
.toc .level-1 { font-weight: bold; margin-top: 1em; }
.toc a { color: inherit; text-decoration: none; }
.part-opener { border-top: .35em solid #315c7b; break-before: page; padding: 20% 0 12%; text-align: center; }
.part-opener h1 { margin-top: 0; }
.opener-watermark, .folk-divider { display: block; margin: 1.5em auto; max-width: 90%; }
.illustration { break-inside: avoid; margin: 1.4em 0; text-align: center; }
.illustration .image-set { display: block; }
.illustration .image-set img { margin: .25em; max-height: 70vh; width: auto; }
.illustration.portrait-grid .image-set img { max-width: 28%; }
.drop-cap::first-letter { color: #315c7b; float: left; font-size: 3em; line-height: .82; padding: .08em .08em 0 0; }
.pagebreak, .edition-colophon { break-before: page; }
.closing-invitation { color: #142f59; font-size: 1.25em; font-weight: bold; margin: 2em 0; text-align: center; }
.cover-image { margin: 0; padding: 0; text-align: center; }
.cover-image img { display: block; margin: 0 auto; max-height: 100vh; max-width: 100%; }
@media (max-width: 32em) { body { padding: 0 3%; } .illustration.portrait-grid .image-set img { max-width: 44%; } }
"""


def navigation_documents(
    toc_items: list[tuple[int, str, str]],
    language: str,
    title: str,
    identifier: str,
) -> tuple[str, str]:
    contents = "Tartalom" if language == "hu" else "Contents"
    cover_label = "Borító" if language == "hu" else "Cover"
    beginning = "A könyv eleje" if language == "hu" else "Beginning"
    nav_items = "\n".join(
        f'<li class="level-{level}"><a href="content.xhtml#{anchor}">'
        f"{html.escape(section_title)}</a></li>"
        for level, section_title, anchor in toc_items
    )
    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{language}" xml:lang="{language}">
<head><title>{html.escape(title)}</title><link rel="stylesheet" type="text/css" href="styles/book.css" /></head>
<body><nav epub:type="toc" id="toc"><h1>{contents}</h1><ol>{nav_items}</ol></nav>
<nav epub:type="landmarks"><h2>{contents}</h2><ol>
<li><a epub:type="cover" href="cover.xhtml">{cover_label}</a></li>
<li><a epub:type="toc" href="nav.xhtml">{contents}</a></li>
<li><a epub:type="bodymatter" href="content.xhtml">{beginning}</a></li>
</ol></nav></body></html>"""
    points = "\n".join(
        f'<navPoint id="nav-{index}" playOrder="{index}"><navLabel><text>'
        f"{html.escape(section_title)}</text></navLabel>"
        f'<content src="content.xhtml#{anchor}" /></navPoint>'
        for index, (_, section_title, anchor) in enumerate(toc_items, start=1)
    )
    ncx = f"""<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="{language}">
<head><meta name="dtb:uid" content="{identifier}" /><meta name="dtb:depth" content="1" />
<meta name="dtb:totalPageCount" content="0" /><meta name="dtb:maxPageNumber" content="0" /></head>
<docTitle><text>{html.escape(title)}</text></docTitle><navMap>{points}</navMap></ncx>"""
    return nav, ncx


def package_document(
    metadata: dict[str, object],
    version: dict[str, object],
    identifier: str,
    assets: dict[str, tuple[str, bytes]],
) -> str:
    subjects = "\n".join(
        f"<dc:subject>{html.escape(str(keyword))}</dc:subject>"
        for keyword in metadata["keywords"]
    )
    image_items = "\n".join(
        f'<item id="image-{index}" href="images/{filename}" media-type="{media_type}" />'
        for index, (filename, (media_type, _)) in enumerate(sorted(assets.items()), 1)
    )
    return f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" prefix="rendition: http://www.idpf.org/vocab/rendition/#">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="book-id">{identifier}</dc:identifier><dc:title>{html.escape(str(metadata['title']))}</dc:title>
<dc:creator>{html.escape(str(metadata['author']))}</dc:creator><dc:language>{html.escape(str(metadata['language']))}</dc:language>
<dc:description>{html.escape(str(metadata['subject']))}</dc:description><dc:date>{version['published']}</dc:date>
<dc:publisher>MyScoutee</dc:publisher><dc:rights>{html.escape(str(metadata['copyright']))}</dc:rights>{subjects}
<meta property="dcterms:modified">{version['published']}T00:00:00Z</meta><meta name="cover" content="cover-image" />
<meta property="rendition:layout">reflowable</meta><meta property="rendition:orientation">auto</meta><meta property="rendition:spread">auto</meta>
</metadata><manifest>
<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image" />
<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />
<item id="content" href="content.xhtml" media-type="application/xhtml+xml" />
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
<item id="css" href="styles/book.css" media-type="text/css" />{image_items}
</manifest><spine toc="ncx"><itemref idref="cover" linear="no" /><itemref idref="nav" linear="no" /><itemref idref="content" /></spine>
<guide><reference type="cover" title="Cover" href="cover.xhtml" /><reference type="toc" title="Table of Contents" href="nav.xhtml" />
<reference type="text" title="Beginning" href="content.xhtml" /></guide></package>"""


def validate_epub(epub_path: Path) -> None:
    xhtml_ns = "http://www.w3.org/1999/xhtml"
    opf_ns = "http://www.idpf.org/2007/opf"
    container_ns = "urn:oasis:names:tc:opendocument:xmlns:container"
    with zipfile.ZipFile(epub_path) as archive:
        infos = archive.infolist()
        names = [info.filename for info in infos]
        if not infos or infos[0].filename != "mimetype":
            raise ValueError("EPUB mimetype is not the first archive entry")
        if infos[0].compress_type != zipfile.ZIP_STORED:
            raise ValueError("EPUB mimetype must be uncompressed")
        if archive.read("mimetype") != b"application/epub+zip":
            raise ValueError("EPUB mimetype value is invalid")
        if len(names) != len(set(names)):
            raise ValueError("EPUB contains duplicate archive entries")
        if any(name.startswith("/") or ".." in Path(name).parts for name in names):
            raise ValueError("EPUB contains an unsafe archive path")

        container = ElementTree.fromstring(archive.read("META-INF/container.xml"))
        rootfile = container.find(f".//{{{container_ns}}}rootfile")
        if rootfile is None:
            raise ValueError("EPUB container has no rootfile")
        package_path = rootfile.attrib["full-path"]
        package = ElementTree.fromstring(archive.read(package_path))
        manifest = {
            item.attrib["id"]: item
            for item in package.findall(f".//{{{opf_ns}}}item")
        }
        if not any("cover-image" in item.attrib.get("properties", "") for item in manifest.values()):
            raise ValueError("EPUB package has no cover image")
        nav_items = [
            item for item in manifest.values()
            if "nav" in item.attrib.get("properties", "").split()
        ]
        if len(nav_items) != 1:
            raise ValueError("EPUB package requires one navigation document")
        for item in manifest.values():
            target = str(Path(package_path).parent / item.attrib["href"])
            if target not in names:
                raise ValueError(f"EPUB manifest target is missing: {target}")
        for itemref in package.findall(f".//{{{opf_ns}}}itemref"):
            if itemref.attrib.get("idref") not in manifest:
                raise ValueError("EPUB spine references an unknown item")

        content_bytes = archive.read("OEBPS/content.xhtml")
        content = ElementTree.fromstring(content_bytes)
        content_ids = {
            element.attrib["id"] for element in content.iter() if "id" in element.attrib
        }
        visible_text = " ".join(content.itertext())
        if "https://" in visible_text or "http://" in visible_text:
            raise ValueError("EPUB exposes a raw URL instead of a source link")
        if b'<span class="drop-cap ' in content_bytes:
            raise ValueError("EPUB contains split drop-cap words")
        if b"data:" in content_bytes:
            raise ValueError("EPUB contains an unpackaged data URL")
        for image in content.findall(f".//{{{xhtml_ns}}}img"):
            target = str(Path("OEBPS") / image.attrib["src"])
            if target not in names:
                raise ValueError(f"EPUB content image is missing: {target}")

        nav = ElementTree.fromstring(archive.read("OEBPS/nav.xhtml"))
        for anchor in nav.findall(f".//{{{xhtml_ns}}}a"):
            href = anchor.attrib.get("href", "")
            if href.startswith("content.xhtml#"):
                if href.split("#", 1)[1] not in content_ids:
                    raise ValueError(f"EPUB navigation target is missing: {href}")

        lower_text = visible_text.lower()
        for issue_pattern in (
            r"\budapest\b",
            r"\bventually\b",
            r"\bhailand\b",
            r"\bussia\b",
            r"\bfter\b",
            r"tourism-security",
            r"friendship-centred",
        ):
            if re.search(issue_pattern, lower_text):
                raise ValueError(
                    f"EPUB still exposes reported Kindle pattern: {issue_pattern}"
                )


def write_archive(output_path: Path, entries: dict[str, bytes], published: str) -> None:
    stamp = date.fromisoformat(published)
    timestamp = (stamp.year, stamp.month, stamp.day, 0, 0, 0)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix=f".{output_path.name}.", suffix=".tmp", dir=output_path.parent, delete=False
    ) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with zipfile.ZipFile(temporary_path, "w") as archive:
            mimetype = zipfile.ZipInfo("mimetype", timestamp)
            mimetype.compress_type = zipfile.ZIP_STORED
            mimetype.external_attr = 0o100644 << 16
            archive.writestr(mimetype, b"application/epub+zip")
            for filename in sorted(entries):
                info = zipfile.ZipInfo(filename, timestamp)
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, entries[filename], compresslevel=9)
        validate_epub(temporary_path)
        temporary_path.replace(output_path)
        output_path.chmod(0o644)
    finally:
        temporary_path.unlink(missing_ok=True)


def build_epub(
    *,
    source: Path,
    cover_pdf: Path,
    output_path: Path,
    version: dict[str, object],
    metadata: dict[str, object],
    document: str,
    toc_items: list[tuple[int, str, str]],
    subtitle: str,
) -> dict[str, object]:
    language = str(metadata["language"])
    pdf_digest = verify_published_pdf(cover_pdf, version, metadata)
    body, assets = extract_images(normalize_body(document, language))
    title = str(metadata["title"])
    identifier_seed = (
        f"myscoutee:{version['trilogy_part']}:{version['version']}:{language}"
    )
    identifier = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, identifier_seed)}"
    nav, ncx = navigation_documents(toc_items, language, title, identifier)
    cover = render_cover(cover_pdf)
    package = package_document(metadata, version, identifier, assets)
    cover_xhtml = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{language}" xml:lang="{language}">
<head><title>{html.escape(title)}</title><link rel="stylesheet" type="text/css" href="styles/book.css" /></head>
<body epub:type="cover"><div class="cover-image"><img src="images/cover.jpg" alt="{html.escape(title, quote=True)}" /></div></body></html>"""
    content = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{language}" xml:lang="{language}">
<head><title>{html.escape(subtitle)}</title><link rel="stylesheet" type="text/css" href="styles/book.css" /></head>
<body>{body}</body></html>"""
    container = b"""<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>
<rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
</rootfiles></container>"""
    entries = {
        "META-INF/container.xml": container,
        "OEBPS/package.opf": package.encode("utf-8"),
        "OEBPS/cover.xhtml": cover_xhtml.encode("utf-8"),
        "OEBPS/content.xhtml": content.encode("utf-8"),
        "OEBPS/nav.xhtml": nav.encode("utf-8"),
        "OEBPS/toc.ncx": ncx.encode("utf-8"),
        "OEBPS/styles/book.css": stylesheet().encode("utf-8"),
        "OEBPS/images/cover.jpg": cover,
    }
    for filename, (_, payload) in assets.items():
        entries[f"OEBPS/images/{filename}"] = payload
    write_archive(output_path, entries, str(version["published"]))
    return {
        "cover_pdf": cover_pdf,
        "cover_pdf_sha256": pdf_digest,
        "source_sha256": sha256_file(source),
        "asset_count": len(assets) + 1,
        "toc_entries": len(toc_items),
        "archive_entries": len(entries) + 1,
    }
