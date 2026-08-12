# Published artifacts

This is a flat directory for the approved public book and final public film.
Drafts, platform tests and rejected exports do not belong here.

The current editable book PDF remains under `../book/draft/`. When the Founder
explicitly locks an edition, the book builder writes directly into this
directory:

- the versioned public PDF with embedded document metadata;
- its `.pdf.sha256` checksum;
- its `.publication.json` manifest.

After a successful publication build, the same-version draft PDF remains as the
editable working export. The builder refuses to overwrite an existing locked
edition. The checksum detects byte-level changes; the overwrite guard, manifest
and Git history provide the rest of the publication boundary.

The first public release date is 12 August 2026. Corrections completed before
that release remain within edition `1.0.0`; its checksum and manifest identify
the released bytes, while Git history preserves the preceding working builds.

The final film will live beside the book artifacts only after picture, voice,
music, subtitles, brand and delivery QA are approved. Its filename must say
that it is the public master. No slideshow or animatic is produced.
