#!/usr/bin/env python3
"""Synchronize the reviewable QA workbook from its canonical CSV source."""

from __future__ import annotations

import csv
import os
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


QA_ROOT = Path(__file__).resolve().parent.parent
REPOSITORY_ROOT = QA_ROOT.parent.parent
CSV_PATH = QA_ROOT / "matrices" / "ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv"
XLSX_PATH = QA_ROOT / "matrices" / "ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx"

SHEET_XML = "xl/worksheets/sheet1.xml"
SHARED_STRINGS_XML = "xl/sharedStrings.xml"
STYLES_XML = "xl/styles.xml"
NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

ROW_FILL_COLORS = {
    "pass": "FF92D050",
    "partial": "FFFFC000",
    "fail": "FFFF6666",
    "not-run": "FFB4C6E7",
    "legend-x": "FFBFBFBF",
    "legend-delta": "FF5B9BD5",
    "legend-indirect": "FFB4A7D6",
    "legend-gap": "FFFF7C80",
}
HEADER_FILL_COLOR = "FF1F4E78"
LEGEND_SECTION_FILL_COLOR = "FF44546A"
TEST_SECTION_FILL_COLOR = "FF4472C4"
EFFECT_MARKERS_TITLE = "EFFECT MARKERS"
QA_TEST_CASES_TITLE = "QA TEST CASES"

ET.register_namespace("", NS)
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
ET.register_namespace("xdr", "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing")
ET.register_namespace("x14", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/main")
ET.register_namespace("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006")


def cell_column(index: int) -> str:
    value = index + 1
    result = ""
    while value:
        value, remainder = divmod(value - 1, 26)
        result = chr(ord("A") + remainder) + result
    return result


def load_rows() -> list[list[str]]:
    with CSV_PATH.open("r", encoding="utf-8", newline="") as source:
        rows = list(csv.reader(source))
    if not rows:
        raise RuntimeError("QA matrix CSV is empty.")
    column_count = len(rows[0])
    if column_count == 0 or any(len(row) != column_count for row in rows):
        raise RuntimeError("QA matrix CSV has inconsistent column counts.")
    return rows


def workbook_rows(source_rows: list[list[str]]) -> list[list[str]]:
    headers = source_rows[0]
    legend_source_rows = [row for row in source_rows[1:] if row[0].startswith("LEGEND-")]
    test_rows = [row for row in source_rows[1:] if not row[0].startswith("LEGEND-")]

    def compact_row(*values: str) -> list[str]:
        return [*values, *("" for _ in range(len(headers) - len(values)))]

    counts = {"done": 0, "pending": 0, "not-started": 0, "failed": 0}
    for row in test_rows:
        counts[qa_status_bucket(dict(zip(headers, row)))] += 1
    legend_items = [
        (
            item["ID"].removeprefix("LEGEND-"),
            f"{item['Scenario']} — {item['Next manual oracle']}",
        )
        for item in (dict(zip(headers, row)) for row in legend_source_rows)
    ]
    status_items = [
        ("Total", str(len(test_rows))),
        ("Done", str(counts["done"])),
        ("Pending", str(counts["pending"])),
        ("Not started", str(counts["not-started"])),
        ("Failed", str(counts["failed"])),
        (
            "Complete",
            f"{(counts['done'] / len(test_rows)):.0%}" if test_rows else "0%",
        ),
    ]
    overview_rows = [compact_row(
        EFFECT_MARKERS_TITLE,
        "",
        "",
        status_items[0][0],
        status_items[0][1],
    )]
    remaining_status_items = status_items[1:]
    for row_index in range(max(len(legend_items), len(remaining_status_items))):
        marker, marker_explanation = (
            legend_items[row_index] if row_index < len(legend_items) else ("", "")
        )
        status, count = (
            remaining_status_items[row_index]
            if row_index < len(remaining_status_items)
            else ("", "")
        )
        overview_rows.append(
            compact_row(marker, marker_explanation, "", status, count)
        )

    return [
        *overview_rows,
        compact_row(QA_TEST_CASES_TITLE),
        headers,
        *test_rows,
    ]


def qa_status_bucket(item: dict[str, str]) -> str:
    manual_status = item.get("Manual status", "").upper()
    result = item.get("Result", "").upper()
    combined = f"{manual_status} {result}"
    if "FAIL" in combined or "CLEAN RETEST REQUIRED" in combined:
        return "failed"
    if "NOT RUN" in combined or "NOT IMPLEMENTED" in combined:
        return "not-started"
    pending_markers = (
        "PARTIAL",
        "PENDING",
        "IN PROGRESS",
        "OPEN",
        "RETEST REQUIRED",
        "IMPLEMENTATION UPDATED",
        "REQUIRED EVERY SESSION",
    )
    if any(marker in combined for marker in pending_markers):
        return "pending"
    if result == "PASS" or "PASS" in manual_status:
        return "done"
    return "pending"


def shared_string_table(rows: list[list[str]]) -> tuple[list[str], dict[str, int]]:
    strings: list[str] = []
    indexes: dict[str, int] = {}
    for row in rows:
        for value in row:
            if value not in indexes:
                indexes[value] = len(strings)
                strings.append(value)
    return strings, indexes


def build_shared_strings(strings: list[str], value_count: int) -> bytes:
    root = ET.Element(f"{{{NS}}}sst", {
        "count": str(value_count),
        "uniqueCount": str(len(strings)),
    })
    xml_space = "{http://www.w3.org/XML/1998/namespace}space"
    for value in strings:
        item = ET.SubElement(root, f"{{{NS}}}si")
        text = ET.SubElement(item, f"{{{NS}}}t")
        if value != value.strip():
            text.set(xml_space, "preserve")
        text.text = value
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def ensure_fill(fills: ET.Element, rgb: str) -> int:
    for index, fill in enumerate(fills.findall(f"{{{NS}}}fill")):
        pattern = fill.find(f"{{{NS}}}patternFill")
        foreground = None if pattern is None else pattern.find(f"{{{NS}}}fgColor")
        if (
            pattern is not None
            and pattern.get("patternType") == "solid"
            and foreground is not None
            and foreground.get("rgb") == rgb
        ):
            return index

    fill = ET.SubElement(fills, f"{{{NS}}}fill")
    pattern = ET.SubElement(fill, f"{{{NS}}}patternFill", {"patternType": "solid"})
    ET.SubElement(pattern, f"{{{NS}}}fgColor", {"rgb": rgb})
    ET.SubElement(pattern, f"{{{NS}}}bgColor", {"indexed": "64"})
    fills.set("count", str(len(fills.findall(f"{{{NS}}}fill"))))
    return len(fills.findall(f"{{{NS}}}fill")) - 1


def ensure_header_font(fonts: ET.Element) -> int:
    for index, font in enumerate(fonts.findall(f"{{{NS}}}font")):
        color = font.find(f"{{{NS}}}color")
        if font.find(f"{{{NS}}}b") is not None and color is not None and color.get("rgb") == "FFFFFFFF":
            return index

    font = ET.SubElement(fonts, f"{{{NS}}}font")
    ET.SubElement(font, f"{{{NS}}}b")
    ET.SubElement(font, f"{{{NS}}}sz", {"val": "10"})
    ET.SubElement(font, f"{{{NS}}}color", {"rgb": "FFFFFFFF"})
    ET.SubElement(font, f"{{{NS}}}name", {"val": "Arial"})
    ET.SubElement(font, f"{{{NS}}}family", {"val": "2"})
    fonts.set("count", str(len(fonts.findall(f"{{{NS}}}font"))))
    return len(fonts.findall(f"{{{NS}}}font")) - 1


def ensure_thick_border(borders: ET.Element, side_names: tuple[str, ...]) -> int:
    for index, border in enumerate(borders.findall(f"{{{NS}}}border")):
        matches = True
        for side_name in ("left", "right", "top", "bottom"):
            side = border.find(f"{{{NS}}}{side_name}")
            expected_style = "medium" if side_name in side_names else None
            if side is None or side.get("style") != expected_style:
                matches = False
                break
        if matches:
            return index

    border = ET.SubElement(borders, f"{{{NS}}}border")
    for side_name in ("left", "right", "top", "bottom"):
        attributes = {"style": "medium"} if side_name in side_names else {}
        side = ET.SubElement(border, f"{{{NS}}}{side_name}", attributes)
        if side_name in side_names:
            ET.SubElement(side, f"{{{NS}}}color", {"rgb": "FF44546A"})
    ET.SubElement(border, f"{{{NS}}}diagonal")
    borders.set("count", str(len(borders.findall(f"{{{NS}}}border"))))
    return len(borders.findall(f"{{{NS}}}border")) - 1


def ensure_cell_style(
    cell_xfs: ET.Element,
    fill_id: int,
    font_id: int = 0,
    border_id: int = 0,
) -> int:
    for index, style in enumerate(cell_xfs.findall(f"{{{NS}}}xf")):
        if (
            style.get("fillId") == str(fill_id)
            and style.get("fontId") == str(font_id)
            and style.get("borderId") == str(border_id)
            and style.get("applyFill") == "true"
        ):
            return index

    ET.SubElement(cell_xfs, f"{{{NS}}}xf", {
        "numFmtId": "164",
        "fontId": str(font_id),
        "fillId": str(fill_id),
        "borderId": str(border_id),
        "xfId": "0",
        "applyFont": "true" if font_id else "false",
        "applyFill": "true",
        "applyBorder": "true" if border_id else "false",
        "applyAlignment": "false",
        "applyProtection": "false",
    })
    cell_xfs.set("count", str(len(cell_xfs.findall(f"{{{NS}}}xf"))))
    return len(cell_xfs.findall(f"{{{NS}}}xf")) - 1


def build_styles(existing: bytes) -> tuple[bytes, dict[str, int]]:
    root = ET.fromstring(existing)
    fonts = root.find(f"{{{NS}}}fonts")
    fills = root.find(f"{{{NS}}}fills")
    borders = root.find(f"{{{NS}}}borders")
    cell_xfs = root.find(f"{{{NS}}}cellXfs")
    if fonts is None or fills is None or borders is None or cell_xfs is None:
        raise RuntimeError("QA workbook styles structure is unsupported.")

    styles = {
        key: ensure_cell_style(cell_xfs, ensure_fill(fills, color))
        for key, color in ROW_FILL_COLORS.items()
    }
    header_font = ensure_header_font(fonts)
    styles["header"] = ensure_cell_style(
        cell_xfs,
        ensure_fill(fills, HEADER_FILL_COLOR),
        header_font,
    )
    styles["legend-section"] = ensure_cell_style(
        cell_xfs,
        ensure_fill(fills, LEGEND_SECTION_FILL_COLOR),
        header_font,
    )
    styles["test-section"] = ensure_cell_style(
        cell_xfs,
        ensure_fill(fills, TEST_SECTION_FILL_COLOR),
        header_font,
    )
    styles["default"] = 0

    border_variants = {
        "top-left": ("top", "left"),
        "top": ("top",),
        "top-right": ("top", "right"),
        "left": ("left",),
        "right": ("right",),
        "bottom-left": ("bottom", "left"),
        "bottom": ("bottom",),
        "bottom-right": ("bottom", "right"),
    }
    for base_key in tuple(styles):
        base_style = cell_xfs.findall(f"{{{NS}}}xf")[styles[base_key]]
        fill_id = int(base_style.get("fillId", "0"))
        font_id = int(base_style.get("fontId", "0"))
        for suffix, side_names in border_variants.items():
            styles[f"{base_key}-{suffix}"] = ensure_cell_style(
                cell_xfs,
                fill_id,
                font_id,
                ensure_thick_border(borders, side_names),
            )
    return ET.tostring(root, encoding="utf-8", xml_declaration=True), styles


def row_style(values: list[str], headers: list[str]) -> str:
    if values == headers:
        return "header"

    item = dict(zip(headers, values))
    identifier = item.get("ID", "")
    legend_styles = {
        "LEGEND-X": "legend-x",
        "LEGEND-DELTA": "legend-delta",
        "LEGEND-INDIRECT": "legend-indirect",
        "LEGEND-GAP": "legend-gap",
        "X": "legend-x",
        "DELTA": "legend-delta",
        "INDIRECT": "legend-indirect",
        "GAP": "legend-gap",
    }
    if identifier in legend_styles:
        return legend_styles[identifier]

    manual_status = item.get("Manual status", "").upper()
    result = item.get("Result", "").upper()
    combined = f"{manual_status} {result}"
    if "FAIL" in combined or "CLEAN RETEST REQUIRED" in combined:
        return "fail"
    if result == "PASS":
        return "pass"
    if "PARTIAL" in combined or "OPEN" in combined:
        return "partial"
    if "NOT RUN" in combined:
        return "not-run"
    return "default"


def build_sheet(
    existing: bytes,
    rows: list[list[str]],
    indexes: dict[str, int],
    style_indexes: dict[str, int],
) -> bytes:
    root = ET.fromstring(existing)
    dimension = root.find(f"{{{NS}}}dimension")
    sheet_data = root.find(f"{{{NS}}}sheetData")
    if dimension is None or sheet_data is None:
        raise RuntimeError("QA workbook sheet structure is unsupported.")

    last_column = cell_column(len(rows[0]) - 1)
    headers = next((row for row in rows if row and row[0] == "ID"), None)
    if headers is None:
        raise RuntimeError("QA workbook rows do not contain the column header.")
    dimension.set("ref", f"A1:{last_column}{len(rows)}")
    sheet_data.clear()

    columns = root.find(f"{{{NS}}}cols")
    if columns is None:
        raise RuntimeError("QA workbook sheet does not contain column definitions.")
    overview_last_row = next(
        row_index - 1
        for row_index, values in enumerate(rows, start=1)
        if values[0] == QA_TEST_CASES_TITLE
    )
    overview_widths = {
        1: float(max(len(row[0]) for row in rows[:overview_last_row]) + 1),
        2: float(max(len(row[1]) for row in rows[:overview_last_row]) + 1),
        3: 2.5,
        4: float(max(len(row[3]) for row in rows[:overview_last_row]) + 1),
        5: float(max(len(row[4]) for row in rows[:overview_last_row]) + 1),
    }
    for column in columns.findall(f"{{{NS}}}col"):
        minimum = int(column.get("min", "0"))
        maximum = int(column.get("max", "0"))
        if minimum == maximum and minimum in overview_widths:
            column.set("width", str(overview_widths[minimum]))
            column.set("customWidth", "true")

    existing_merges = root.find(f"{{{NS}}}mergeCells")
    if existing_merges is not None:
        root.remove(existing_merges)

    merged_ranges: list[str] = []
    effect_markers_last_row = 1 + len([
        row for row in rows[1:overview_last_row] if row[0] in {"X", "DELTA", "INDIRECT", "GAP"}
    ])

    marker_styles = {
        "X": "legend-x",
        "DELTA": "legend-delta",
        "INDIRECT": "legend-indirect",
        "GAP": "legend-gap",
    }
    status_styles = {
        "Total": "test-section",
        "Done": "pass",
        "Pending": "partial",
        "Not started": "not-run",
        "Failed": "fail",
        "Complete": "pass",
    }

    for row_index, values in enumerate(rows, start=1):
        style_key = row_style(values, headers)
        is_overview_title = values[0] == EFFECT_MARKERS_TITLE
        is_test_section = values[0] == QA_TEST_CASES_TITLE
        if is_overview_title:
            merged_ranges.append(f"A{row_index}:B{row_index}")
        elif is_test_section:
            merged_ranges.append(f"A{row_index}:{last_column}{row_index}")
        row = ET.SubElement(sheet_data, f"{{{NS}}}row", {
            "r": str(row_index),
            "customFormat": "false",
            "ht": "20" if is_overview_title or is_test_section else "12.8",
            "hidden": "false",
            "customHeight": "true" if is_overview_title or is_test_section else "false",
            "outlineLevel": "0",
            "collapsed": "false",
        })
        for column_index, value in enumerate(values):
            cell_style_key = style_key
            if is_overview_title:
                if column_index in (0, 1):
                    cell_style_key = "legend-section"
                elif column_index in (3, 4):
                    cell_style_key = status_styles[values[3]]
                else:
                    cell_style_key = "default"
            elif is_test_section:
                cell_style_key = "test-section"
            elif values[3] in status_styles:
                if column_index in (0, 1) and values[0] in marker_styles:
                    cell_style_key = marker_styles[values[0]]
                elif column_index in (3, 4):
                    cell_style_key = status_styles[values[3]]
                else:
                    cell_style_key = "default"
            if row_index <= effect_markers_last_row and column_index in (0, 1):
                border_parts = []
                if row_index == 1:
                    border_parts.append("top")
                elif row_index == effect_markers_last_row:
                    border_parts.append("bottom")
                if column_index == 0:
                    border_parts.append("left")
                elif column_index == 1:
                    border_parts.append("right")
                if border_parts:
                    cell_style_key = f"{cell_style_key}-{'-'.join(border_parts)}"
            elif row_index <= overview_last_row and column_index in (3, 4):
                border_parts = []
                if row_index == 1:
                    border_parts.append("top")
                elif row_index == overview_last_row:
                    border_parts.append("bottom")
                if column_index == 3:
                    border_parts.append("left")
                elif column_index == 4:
                    border_parts.append("right")
                if border_parts:
                    cell_style_key = f"{cell_style_key}-{'-'.join(border_parts)}"
            reference = f"{cell_column(column_index)}{row_index}"
            cell = ET.SubElement(row, f"{{{NS}}}c", {
                "r": reference,
                "s": str(style_indexes[cell_style_key]),
                "t": "s",
            })
            ET.SubElement(cell, f"{{{NS}}}v").text = str(indexes[value])

    merges = ET.Element(f"{{{NS}}}mergeCells", {"count": str(len(merged_ranges))})
    for merged_range in merged_ranges:
        ET.SubElement(merges, f"{{{NS}}}mergeCell", {
            "ref": merged_range,
        })
    sheet_position = list(root).index(sheet_data)
    root.insert(sheet_position + 1, merges)

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def synchronize() -> None:
    source_rows = load_rows()
    rows = workbook_rows(source_rows)
    strings, indexes = shared_string_table(rows)
    with zipfile.ZipFile(XLSX_PATH, "r") as workbook:
        entries = {name: workbook.read(name) for name in workbook.namelist()}

    entries[STYLES_XML], style_indexes = build_styles(entries[STYLES_XML])
    entries[SHARED_STRINGS_XML] = build_shared_strings(
        strings,
        sum(len(row) for row in rows),
    )
    entries[SHEET_XML] = build_sheet(entries[SHEET_XML], rows, indexes, style_indexes)

    file_descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{XLSX_PATH.stem}.",
        suffix=".xlsx",
        dir=XLSX_PATH.parent,
    )
    os.close(file_descriptor)
    temporary_path = Path(temporary_name)
    try:
        with zipfile.ZipFile(temporary_path, "w", zipfile.ZIP_DEFLATED) as workbook:
            for name, content in entries.items():
                workbook.writestr(name, content)
        with zipfile.ZipFile(temporary_path, "r") as workbook:
            if workbook.testzip() is not None:
                raise RuntimeError("Generated QA workbook failed ZIP validation.")
        os.replace(temporary_path, XLSX_PATH)
    finally:
        temporary_path.unlink(missing_ok=True)

    print(
        f"Synchronized {XLSX_PATH.relative_to(REPOSITORY_ROOT)} "
        f"from {CSV_PATH.name}: {len(source_rows) - 1} ledger rows"
    )


if __name__ == "__main__":
    synchronize()
