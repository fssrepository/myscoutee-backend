#!/usr/bin/env python3
"""Synchronize the reviewable QA workbook from its canonical CSV source."""

from __future__ import annotations

import csv
import os
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv"
XLSX_PATH = ROOT / "ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx"

SHEET_XML = "xl/worksheets/sheet1.xml"
SHARED_STRINGS_XML = "xl/sharedStrings.xml"
NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"

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


def build_sheet(existing: bytes, rows: list[list[str]], indexes: dict[str, int]) -> bytes:
    root = ET.fromstring(existing)
    dimension = root.find(f"{{{NS}}}dimension")
    sheet_data = root.find(f"{{{NS}}}sheetData")
    if dimension is None or sheet_data is None:
        raise RuntimeError("QA workbook sheet structure is unsupported.")

    last_column = cell_column(len(rows[0]) - 1)
    dimension.set("ref", f"A1:{last_column}{len(rows)}")
    sheet_data.clear()

    for row_index, values in enumerate(rows, start=1):
        row = ET.SubElement(sheet_data, f"{{{NS}}}row", {
            "r": str(row_index),
            "customFormat": "false",
            "ht": "12.8",
            "hidden": "false",
            "customHeight": "false",
            "outlineLevel": "0",
            "collapsed": "false",
        })
        for column_index, value in enumerate(values):
            reference = f"{cell_column(column_index)}{row_index}"
            cell = ET.SubElement(row, f"{{{NS}}}c", {
                "r": reference,
                "s": "0",
                "t": "s",
            })
            ET.SubElement(cell, f"{{{NS}}}v").text = str(indexes[value])

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def synchronize() -> None:
    rows = load_rows()
    strings, indexes = shared_string_table(rows)
    with zipfile.ZipFile(XLSX_PATH, "r") as workbook:
        entries = {name: workbook.read(name) for name in workbook.namelist()}

    entries[SHARED_STRINGS_XML] = build_shared_strings(
        strings,
        sum(len(row) for row in rows),
    )
    entries[SHEET_XML] = build_sheet(entries[SHEET_XML], rows, indexes)

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

    print(f"Synchronized {XLSX_PATH.relative_to(ROOT.parent.parent)} from {CSV_PATH.name}: {len(rows) - 1} cases")


if __name__ == "__main__":
    synchronize()
