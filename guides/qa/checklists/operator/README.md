# Operator tesztek

A meglévő Operator domain négy konszolidált tesztje, a QA-mátrix sorrendjében:

| Teszt | Mit nézünk? | Blokkok |
| --- | --- | --- |
| [Configuration](OPERATOR-CONFIGURATION-LIFECYCLE-001.md) | Nyilvános beállítások, HTTPS, fizetési szolgáltató, Firebase és visszaállítás; a már igazolt WebView/Push bizonyíték újrafelhasználásával | C01–C08 |
| [Registry](OPERATOR-REGISTRY-LIFECYCLE-001.md) | Regisztráció, claim/link, közösség és ranglista, mérési szinkron, deaktiválás és helyreállítás | 1–4; 13 lépés |
| [Updates](OPERATOR-UPDATE-LIFECYCLE-001.md) | Egy kompatibilis QA-kiadás alkalmazása, folyamatjelzés és a telepített verzió | 1–3; 9 lépés |
| [Revenue](OPERATOR-REVENUE-LIFECYCLE-001.md) | Előkészített fizetések összesítése, egy szinkron és egy elszámolás | 1–3; 8 lépés |

A részletes eredmények és a már bizonyított részágak a QA packben és a
CSV/XLSX mátrixban vannak. Ezek az útmutatók nem jelentenek futtatást vagy PASS-t.
A külön fixture- és böngésző-előkészítés az adott teszt indulásakor történik.
