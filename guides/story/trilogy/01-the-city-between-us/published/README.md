# Published artifacts

This is a flat directory for the approved public book and final public film.
Drafts, animatics, platform tests and rejected exports do not belong here.

The current editable book PDF remains under `../book/draft/`. When the Founder
explicitly locks an edition, the book builder writes directly into this
directory:

- the versioned public PDF with embedded document metadata;
- its `.pdf.sha256` checksum;
- its `.publication.json` manifest.

After a successful publication build, the same-version draft PDF is removed so
there is only one current book export. The builder refuses to overwrite an
existing locked edition. The checksum detects byte-level changes; the overwrite
guard, manifest and Git history provide the rest of the publication boundary.

The final film will live beside the book artifacts only after picture, voice,
music, subtitles, brand and delivery QA are approved. Its filename must say
that it is the public master. Storyboard slideshows remain under
`../storyboard/animatics/`.
