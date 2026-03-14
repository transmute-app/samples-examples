# Examples From Real Users

Community-contributed examples showing how people use [Transmute](https://github.com/transmute-app) in the real world: 
- home-lab automations
- media pipelines
- integrations with other tools
- ...

## How to contribute

1. **Fork** this repository.
2. Create a folder under `user-examples/` with a short, descriptive name (e.g. `user-examples/node-red-image-converter/`).
3. Include at minimum:
   - A **`README.md`** explaining what the example does, any prerequisites, and how to run it.
   - The relevant **scripts, configs, or code** needed to reproduce it.
4. Open a **Pull Request** against `main`.

### Folder structure

```
user-examples/
  your-example/
    README.md        ← what it does & how to use it
    script.py        ← (or .sh, .js, docker-compose.yml, flow.json, …)
    ...
```

## Example ideas

Not sure what to contribute? Here are a few ideas to get you started:

| Idea | Description |
|------|-------------|
| **Node-RED flow** | A Node-RED flow that watches a folder and auto-converts new images via the Transmute API |
| **Arr-stack script** | A post-import script for Sonarr/Radarr that converts media files to a preferred format |
| **Bulk converter** | A shell/Python script that walks a directory tree and batch-converts every file |
| **Docker sidecar** | A `docker-compose.yml` that runs Transmute alongside another service with automatic conversion |
| **Cron job** | A scheduled task that converts and cleans up files on a regular interval |
| **Webhook handler** | A small server that listens for webhooks and triggers conversions |

## Guidelines

- Keep examples **self-contained** — someone should be able to clone just your folder and get started.
- Document any **environment variables, API keys, or dependencies** your example needs.
- Avoid committing **secrets or credentials** — use placeholders instead.
- Lean on the official API examples in [`../examples/`](../examples/) for endpoint reference.