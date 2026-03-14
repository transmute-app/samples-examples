# Transmute — Samples & Examples

Sample files for testing conversions and example API scripts for common [Transmute](https://github.com/transmute-app) workflows.

## Repository structure

```
samples/          Sample files in 100+ formats (png, csv, mp3, docx, …)
examples/         API example scripts
  curl-examples.sh        Bash / curl
  requests-examples.py    Python 3 / requests
  fetch-examples.js       Node.js 18+ / fetch
user-examples/    Community-contributed real-world examples
```

## Samples

The `samples/` directory contains one representative file for every format Transmute can handle. Each file is named `<format>.<ext>` (e.g. `png.png`, `csv.csv`). Use them to quickly test uploads and conversions.

## Examples

The `examples/` directory has equivalent scripts in three languages — Bash, Python, and JavaScript — that demonstrate every major API endpoint:

- Health & readiness checks
- Admin bootstrap & authentication
- File upload, list, download, and delete
- Conversions (single & batch)
- Settings, default format mappings, and API key management
- User management

See [examples/README.md](examples/README.md) for setup instructions and full details.

## Community examples

The `user-examples/` directory is a place for community-contributed, real-world integrations. Node-RED flows, arr-stack scripts, cron jobs, Docker sidecars, and anything else built on top of the Transmute API. Contributions are welcome via PR.

See [user-examples/README.md](user-examples/README.md) for contribution guidelines and ideas.
