# Published renders

This directory is reserved for technically finalized publication artifacts.
It intentionally contains no Part I PDF while `book/version.json` has
`locked: false`.

When the Founder explicitly closes an edition, the version is marked as locked
and the default build writes exactly once:

- the versioned PDF with embedded document metadata;
- a `.pdf.sha256` checksum;
- a `.publication.json` manifest recording the checksum, edition, publication
  date and metadata.

The builder refuses to overwrite an existing locked edition. A hash detects a
later byte-level change; it does not make a file physically unwritable. The
overwrite guard, checksum, manifest and Git history together provide the
technical publication boundary. Any correction after closure requires a new
edition version.
