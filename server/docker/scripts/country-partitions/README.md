# Country catalog updates

The backend landing country list and location eligibility both use Mongo
`countryPartitions`. Add the country geometry to the three canonical catalogs;
do not maintain a separate list in the landing component. Country labels are
localized by `Intl.DisplayNames` using the current UI language.

Germany (`DE`, `country:de`) uses OpenStreetMap relation **51477**, downloaded
from Nominatim on 2026-09-22 with `polygon_geojson=1`,
`polygon_threshold=0.001`, `addressdetails=1`, `country=Germany`,
`countrycodes=de`, `format=jsonv2`, `limit=1`. Source: OpenStreetMap contributors
via https://nominatim.openstreetmap.org/search (https://www.openstreetmap.org/copyright).
The saved MultiPolygon includes multiple parts and inner rings. Keep those;
a country bounding rectangle would incorrectly include neighbouring cities.

Use the existing importer with the downloaded response:

```bash
node server/docker/scripts/country-partitions/import-nominatim-country.mjs \
  --input /tmp/myscoutee-country-de.json \
  --object-id 6ab2000000000000000000de \
  --partition-key country:de --country-code DE --country-name Germany \
  --imported-at 2026-09-22T03:20:00.000Z
node server/docker/scripts/country-partitions/export-local-country.mjs DE
```

The local-adapter Germany geometry is generated from the canonical production
catalog; the bounding box is only a fast prefilter. Existing local Hungary
behavior is preserved. No additional application HTTP request is introduced.
The running dev seed watcher imports the catalog; normal release/seed delivery
is still required for other deployments. No German translation bundle is added:
unsupported German language preferences resolve to the existing English bundle.

Verification on 2026-09-22:

- `python3 server/docker/scripts/country-partitions/verify-germany.py`: live
  HTTP eligibility for Berlin/Munich/Hamburg/Cologne; Prague/Zurich rejection;
  Budapest/London preservation; landing `DE`; `de-DE` → `en`; seed parity.
- `country-partitions.repository.spec.ts`: 10 focused local tests pass.
- Existing frontend watcher build successful; no separate application build.
