# Editable book export

This directory contains exactly one replaceable PDF export of the current book
edition while `version.json` has `locked: false`.

The editable source of truth remains the English Markdown manuscript, version
metadata, document metadata and book builder in the parent directory. The PDF
itself is an export, not the editing source.

When an edition is explicitly locked, the builder writes the technically
finalized PDF and its integrity files to `../../published/online/`.
The draft export remains here as the editable working copy; only the published
copy is protected by the overwrite guard, checksum and manifest.
