# Part I published artifacts

Approved release files are separated by delivery format:

- [`online/`](online/) contains the locked English and Hungarian PDF and EPUB
  editions with their SHA-256 checksums and publication manifests.
- [`paperback/`](paperback/) contains only the two English PDF files intended
  for Amazon KDP paperback upload, plus a short upload guide.

Drafts, cover previews, extracted front-cover images, rejected exports and
platform screenshots do not belong under `published/`. Editable PDF exports
remain under `../book/draft/`; paperback cover sources remain under
`../book/assets/` and the builder remains under `../book/`.

The builder refuses to overwrite an existing locked artifact. A later released
correction requires a new version in `../book/version.json`.
