# Transmute API — Examples

Example scripts demonstrating every major API workflow in multiple languages.

## Available examples

| File | Language | HTTP library |
|------|----------|--------------|
| `curl-examples.sh` | Bash | curl |
| `requests-examples.py` | Python 3 | [requests](https://pypi.org/project/requests/) |
| `fetch-examples.js` | JavaScript (Node.js 18+) | built-in `fetch` |

Each file covers the same set of endpoints so you can pick whichever language you prefer.

## Quick start

### Bash (curl)

```bash
# Edit the config section at the top, then:
chmod +x curl-examples.sh
source curl-examples.sh
```

### Python

```bash
pip install requests
# Edit the config section at the top, then:
python requests-examples.py
```

### JavaScript

```bash
# Edit the config section at the top, then:
node fetch-examples.js
```

## Configuration

Every example file has a configuration section at the top. Set these values before running:

| Variable   | Description                          | Default                  |
|------------|--------------------------------------|--------------------------|
| `BASE_URL` | Root URL of your Transmute instance  | `http://localhost:3313`  |
| `API_KEY`  | Bearer token or API key for auth     | *(empty — fill this in)* |

If you don't have an API key yet, each script includes commands to bootstrap
an admin account, authenticate, and create one.

## Covered workflows

- Health & readiness checks
- First-time admin bootstrap
- Authentication (JSON + OAuth2 form)
- File upload, list, download, and delete
- File conversion and conversion history
- Batch download (ZIP)
- App settings (get & update)
- Default format mappings
- API key management (create, list, delete)
- User management (list, create, update, delete)
- Full end-to-end workflow (upload → convert → download)

## Sample files

The scripts reference files in `../samples/` (e.g. `png.png`, `csv.csv`).
Make sure those sample assets exist before running upload examples.
