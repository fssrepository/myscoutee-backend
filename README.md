# MyScoutee Backend

This repository contains the MyScoutee application server, the integrated
frontend build, local Docker environments, production packaging, and the
versioned product documentation.

## Development quick start

Prerequisites are Docker Engine, Docker Compose v2, and a compatible local
Registry source checkout for the Registry service declared by the development
stack.

```bash
cd server
./docker/scripts/bootstrap_mongodb_seed.sh
docker compose up --build
```

The frontend is rebuilt and synchronized automatically. Open
`https://localhost`; the development certificate may need to be trusted
locally.

## Production and test entry points

- [Production packaging and operations](packaging/README.md)
- [Full integration E2E collections](e2e/README.md)
- [Project documentation index](guides/README.md)

## Downloads

### Manuals

| Manual | Document version | Applies to | PDF |
|---|---:|---:|---|
| Operations Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/manuals/MyScoutee_Operations_Manual_v1.0.0_EN.pdf) |
| Administrator Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/manuals/MyScoutee_Administrator_Manual_v1.0.0_EN.pdf) |
| User Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/manuals/MyScoutee_User_Manual_v1.0.0_EN.pdf) |

Editable manual sources and PDF build instructions are in
[`guides/manuals`](guides/manuals/README.md).

### Presentations

| Presentation | Version | PDF | PowerPoint |
|---|---:|---|---|
| MyScoutee Network | 1.0.0 | [PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pdf) | [PPTX](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pptx) |
| MyScoutee Product | 1.0.0 | [PDF](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pdf) | [PPTX](https://raw.githubusercontent.com/fssrepository/myscoutee-backend/master/guides/guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pptx) |
