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

The local-adapter export contains partition IDs, country labels and one sample
location per country. It deliberately excludes country geometry and bounding
boxes. Offline/local profiles retain their assigned partition; the first save
of a new local profile assigns one of the four supported partitions at random.
Geographic eligibility remains a backend HTTP responsibility. No additional
application HTTP request is introduced.
The running dev seed watcher imports the catalog; normal release/seed delivery
is still required for other deployments. No German translation bundle is added:
unsupported German language preferences resolve to the existing English bundle.

Verification on 2026-09-22:

- `python3 server/docker/scripts/country-partitions/verify-germany.py`: live
  HTTP eligibility for Berlin/Munich/Hamburg/Cologne; Prague/Zurich rejection;
  Budapest/London preservation; landing `DE`; `de-DE` → `en`; seed parity.
- `country-partitions.repository.spec.ts`: 10 focused local tests pass.
- Existing frontend watcher build successful; no separate application build.


## Spain — 2026-09-22

Spain (`ES`, `country:es`) uses OpenStreetMap relation **1311341**, with the
same Nominatim GeoJSON settings as Germany, substituting `country=Spain` and
`countrycodes=es`. The mainland, Balearic and Canary island geometries are
preserved. The landing list continues to come from the shared country catalog.
No Spanish language bundle is added: `es-ES` falls back to English.

```bash
node server/docker/scripts/country-partitions/import-nominatim-country.mjs \
  --input /tmp/myscoutee-country-es.json \
  --object-id 6ab2000000000000000000e5 \
  --partition-key country:es --country-code ES --country-name Spain \
  --imported-at 2026-09-22T03:23:33.356443Z
node server/docker/scripts/country-partitions/export-local-country.mjs ES
python3 server/docker/scripts/country-partitions/verify-spain.py
```

Verification passed against the running stack: Madrid, Barcelona, Seville,
Palma and Santa Cruz de Tenerife resolve to `country:es`; Lisbon, Andorra la
Vella and Marseille remain ineligible. Berlin, Budapest and London retain
their partitions. The landing response lists Spain once and a Spanish
Accept-Language header returns `en`. All 19 local country tests pass, and the
existing frontend watcher compiled the change successfully.

## United Kingdom verification — 2026-10-09

The existing `GB` / `country:gb` geometry is identical across production, DEMO
and E2E catalogs and generated into the local adapter. With the live HTTP
security gate enabled, London (England), Edinburgh (Scotland), Cardiff (Wales)
and Belfast (Northern Ireland) all resolve to this partition. Dublin remains
outside it. All 25 local country tests pass, including the same five controls.

The delegated CDP test selected existing London demo member Emma Parker
(ninth entry), received native login `200 / ACCEPTED`, entered `/game` and
logged out. No country geometry or user coordinate was modified. This is one
real demo entry plus regional boundary checks, not a Firebase login test.
The versioned launcher configuration and `tests/e2e/microservices/check-uk-entry.mjs`
reproduce the check; see `tests/qa/README.md`.

## Offline partitions and consistent seed precision — 2026-10-23

1. Simplify the existing four country geometries offline with a topology-preserving
   tolerance of `0.001` degrees. Preserve document metadata, polygons and holes.
   Use the same corrected catalog in both applications and all three Mongo seed
   environments; do not fetch newer boundary data.
2. Export only partition metadata and one predefined sample location per country
   to the frontend. Offline/local profiles use their stored partition; new local
   profiles receive one random supported partition on their first save. Preserve
   that choice on later saves and share it with linked profiles. Remove local
   polygon imports and geographic eligibility checks. Backend HTTP country
   eligibility and all Mongo country geometries remain in place.
3. Assign demo accounts reproducibly across the four supported partitions before
   import/bootstrap. Keep linked profiles with their account. Store coordinates
   with six decimal places of precision in local and Mongo seeds; do not depend
   on the visitor's location to generate seed data. Keep production user seeds empty.
4. Verify catalog parity, topology, supported and unsupported coordinates, local
   seed coverage and Mongo account/profile consistency using focused checks.

Verification of the completed change:

- All six Mongo country catalogs are byte-identical, stored as separate files and
  simplified with the same `0.001` degree topology-preserving tolerance. Country
  document metadata, polygon parts, holes and retained coordinate values are
  preserved. Every demo/E2E user coordinate resolves to its assigned country.
- Demo/local accounts have predefined locations with six-decimal precision;
  linked workspace profiles use the account location and partition. Existing
  local seed records receive a missing partition during the existing seed merge.
- The new-profile assignment runs in the existing local users service; subsequent
  repository writes preserve the assigned partition. No native location request
  or country boundary download is required to make that assignment.
- Focused checks passed: 63 backend-frontend tests and 13 template tests. Both
  production builds passed. The same source/entry-point chunk membership, static
  and dynamic import edges, and initial loading boundaries were preserved
  (backend: 266 JS chunks; template: 101). Initial JS bytes are unchanged.
- Compared with the previous rollback build containing full frontend country
  geometry, JavaScript output decreased by 1,071,467 bytes in the backend app and
  1,072,758 bytes in the template. The four local country source files together
  now occupy 1,871 bytes. Local validation output is under
  `server/build/seed-precision/`; no VM, live Mongo import or browser QA was run.
