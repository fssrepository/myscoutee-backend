# MyScoutee official manuals

This directory contains the maintainable HTML sources and directly
downloadable PDF releases of the English manuals and integration guide.

| Manual | Document ID | Document version | PDF |
|---|---:|---:|---|
| Operations Manual | MSC-OM-001 | 1.4.1 | [Download PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/publication/manuals/MyScoutee_Operations_Manual_EN.pdf) |
| Administrator Manual | MSC-AM-001 | 1.4.1 | [Download PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/publication/manuals/MyScoutee_Administrator_Manual_EN.pdf) |
| User Manual | MSC-UM-001 | 1.4.1 | [Download PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/publication/manuals/MyScoutee_User_Manual_EN.pdf) |
| Integration API Guide | MSC-API-001 | 1.4.1 | [Download PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/publication/manuals/MyScoutee_Integration_API_Guide_EN.pdf) |
| MCP User Guide | MSC-MCP-001 | 1.4.1 | [Download PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/publication/manuals/MyScoutee_MCP_User_Guide_EN.pdf) |
| Microservices Guide (implementation preview) | MSC-MS-001 | 1.4.1 | [Download PDF](MyScoutee_Microservices_Guide_EN.pdf) |

## Regenerating the PDFs

Prerequisites: Node.js, the development dependencies installed in `frontend`,
and Google Chrome/Chromium or Playwright's bundled browser.

```bash
(cd frontend && npm ci)
node guides/publication/manuals/build-manuals.mjs
```

To regenerate only one integration guide:

```bash
node guides/publication/manuals/build-manuals.mjs MSC-API-001
node guides/publication/manuals/build-manuals.mjs MSC-MCP-001
node guides/publication/manuals/build-manuals.mjs MSC-MS-001
```

For a non-standard browser path:

```bash
DOCS_CHROME_PATH=/absolute/path/to/chrome \
  node guides/publication/manuals/build-manuals.mjs
```

The build overwrites the selected PDFs and automatically copies them to
`frontend/guides/manuals` in the public frontend repository. The public README
download links point to these copies.

When document content changes, update the version on the cover, in the
document-control table and in the build metadata. Keep version numbers inside
the documents, never in PDF filenames. Download links remain stable; Git history
and release tags retain earlier revisions.
Do not keep successive versions of the same manual side by side in the working
tree. The Microservices Guide uses `MyScoutee_Microservices_Guide_EN.pdf`.

## Release verification

```bash
pdfinfo guides/publication/manuals/MyScoutee_Operations_Manual_EN.pdf
pdfinfo guides/publication/manuals/MyScoutee_Administrator_Manual_EN.pdf
pdfinfo guides/publication/manuals/MyScoutee_User_Manual_EN.pdf
pdfinfo guides/publication/manuals/MyScoutee_Integration_API_Guide_EN.pdf
pdfinfo guides/publication/manuals/MyScoutee_MCP_User_Guide_EN.pdf
pdfinfo guides/publication/manuals/MyScoutee_Microservices_Guide_EN.pdf
```

The PDF sources document the current state of the user interface, backend,
deployment package, and operations scripts. Reassess the manuals before
applying them to a different software version.
