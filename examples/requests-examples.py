#!/usr/bin/env python3
# ============================================================================
# Transmute API — Python (requests) Examples
# ============================================================================
# Demonstrates every major API endpoint using the requests library and the
# sample files found in assets/samples/.
#
# Usage:
#   1. pip install requests
#   2. Fill in the configuration below.
#   3. Run individual snippets or the whole file.
# ============================================================================

import json
import os
import requests

# ── Configuration ───────────────────────────────────────────────────────────
# Set your Transmute base URL (no trailing slash)
BASE_URL = "http://localhost:3313"

# Set your API key or JWT bearer token here.
# You can obtain one via the authentication or API key endpoints below.
API_KEY = "your-api-key-here"

# Shorthand for the Authorization header used by most endpoints.
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

# Path to sample files (relative to this script's location)
SAMPLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "samples")

# ============================================================================
#  1. Health & Readiness (no authentication required)
# ============================================================================

# Application metadata (name & version)
r = requests.get(f"{BASE_URL}/api/health/info")
print(json.dumps(r.json(), indent=2))

# Liveness probe
r = requests.get(f"{BASE_URL}/api/health/live")
print(json.dumps(r.json(), indent=2))

# Readiness probe (checks database + storage)
r = requests.get(f"{BASE_URL}/api/health/ready")
print(json.dumps(r.json(), indent=2))

# ============================================================================
#  2. Bootstrap & User Creation
# ============================================================================

# Check if the application needs its first admin account
r = requests.get(f"{BASE_URL}/api/users/bootstrap-status")
print(json.dumps(r.json(), indent=2))

# Create the initial admin user (no auth required when no users exist)
r = requests.post(
    f"{BASE_URL}/api/users",
    json={
        "username": "admin",
        "password": "correct horse battery staple",
        "email": "admin@example.com",
        "full_name": "Admin User",
    },
)
print(json.dumps(r.json(), indent=2))

# ============================================================================
#  3. Authentication
# ============================================================================

# Authenticate with JSON body — returns a JWT access token
r = requests.post(
    f"{BASE_URL}/api/users/authenticate",
    json={
        "username": "admin",
        "password": "correct horse battery staple",
    },
)
print(json.dumps(r.json(), indent=2))

# Authenticate via OAuth2 password form (used by Swagger UI / token clients)
r = requests.post(
    f"{BASE_URL}/api/users/token",
    data={
        "username": "admin",
        "password": "correct horse battery staple",
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"},
)
print(json.dumps(r.json(), indent=2))

# TIP: Capture the token for subsequent requests:
#   r = requests.post(f"{BASE_URL}/api/users/authenticate",
#       json={"username": "admin", "password": "correct horse battery staple"})
#   token = r.json()["access_token"]
#   HEADERS = {"Authorization": f"Bearer {token}"}

# ============================================================================
#  4. Upload Files
# ============================================================================

# Upload a PNG image
with open(os.path.join(SAMPLES_DIR, "png.png"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# Upload a CSV spreadsheet
with open(os.path.join(SAMPLES_DIR, "csv.csv"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# Upload a Markdown document
with open(os.path.join(SAMPLES_DIR, "md.md"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# Upload an SVG image
with open(os.path.join(SAMPLES_DIR, "svg.svg"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# Upload a DOCX document
with open(os.path.join(SAMPLES_DIR, "docx.docx"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# Upload an MP3 audio file
with open(os.path.join(SAMPLES_DIR, "mp3.mp3"), "rb") as f:
    r = requests.post(f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f})
print(json.dumps(r.json(), indent=2))

# ============================================================================
#  5. List Uploaded Files
# ============================================================================

# List all uploaded files (returns IDs, filenames, compatible output formats)
r = requests.get(f"{BASE_URL}/api/files", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
#  6. Convert a File
# ============================================================================
# Replace <FILE_ID> with an actual file ID from the upload or list response.

FILE_ID = "<FILE_ID>"

# Convert a PNG to WEBP
r = requests.post(
    f"{BASE_URL}/api/conversions",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"id": FILE_ID, "output_format": "webp"},
)
print(json.dumps(r.json(), indent=2))

# Convert a CSV to JSON
# (upload csv.csv first, then use its file ID)
r = requests.post(
    f"{BASE_URL}/api/conversions",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"id": FILE_ID, "output_format": "json"},
)
print(json.dumps(r.json(), indent=2))

# Convert a Markdown file to HTML
# (upload md.md first, then use its file ID)
r = requests.post(
    f"{BASE_URL}/api/conversions",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"id": FILE_ID, "output_format": "html"},
)
print(json.dumps(r.json(), indent=2))

# ============================================================================
#  7. Download a File
# ============================================================================
# Replace <FILE_ID> with an uploaded or converted file ID.

# Download to a file
r = requests.get(f"{BASE_URL}/api/files/{FILE_ID}", headers=HEADERS)
with open("downloaded_file.webp", "wb") as f:
    f.write(r.content)

# Save a converted file with a specific name
CONVERTED_ID = "<CONVERTED_FILE_ID>"
r = requests.get(f"{BASE_URL}/api/files/{CONVERTED_ID}", headers=HEADERS)
with open("converted_output.webp", "wb") as f:
    f.write(r.content)

# ============================================================================
#  8. Batch Download (ZIP)
# ============================================================================
# Provide an array of converted file IDs to receive a ZIP archive.

r = requests.post(
    f"{BASE_URL}/api/files/batch",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"file_ids": ["<CONVERTED_ID_1>", "<CONVERTED_ID_2>"]},
)
with open("transmute_batch.zip", "wb") as f:
    f.write(r.content)

# ============================================================================
#  9. List Completed Conversions
# ============================================================================

r = requests.get(f"{BASE_URL}/api/conversions/complete", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 10. Delete a Conversion
# ============================================================================

# Delete a single conversion by ID
r = requests.delete(f"{BASE_URL}/api/conversions/{CONVERTED_ID}", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Delete ALL conversions
r = requests.delete(f"{BASE_URL}/api/conversions/all", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 11. Delete Files
# ============================================================================

# Delete a single uploaded file
r = requests.delete(f"{BASE_URL}/api/files/{FILE_ID}", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Delete ALL uploaded files
r = requests.delete(f"{BASE_URL}/api/files/all", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 12. App Settings
# ============================================================================

# Get current settings
r = requests.get(f"{BASE_URL}/api/settings", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Update theme
r = requests.patch(
    f"{BASE_URL}/api/settings",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"theme": "nigredo"},
)
print(json.dumps(r.json(), indent=2))

# Disable auto-download and enable keep_originals
r = requests.patch(
    f"{BASE_URL}/api/settings",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"auto_download": False, "keep_originals": True},
)
print(json.dumps(r.json(), indent=2))

# Update cleanup settings (admin only)
r = requests.patch(
    f"{BASE_URL}/api/settings",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"cleanup_enabled": True, "cleanup_ttl_minutes": 120},
)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 13. Default Format Mappings
# ============================================================================

# Get all default format mappings
r = requests.get(f"{BASE_URL}/api/default-formats", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Set a default: always convert PNG → WEBP
r = requests.put(
    f"{BASE_URL}/api/default-formats",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"input_format": "png", "output_format": "webp"},
)
print(json.dumps(r.json(), indent=2))

# Set a default: always convert CSV → JSON
r = requests.put(
    f"{BASE_URL}/api/default-formats",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"input_format": "csv", "output_format": "json"},
)
print(json.dumps(r.json(), indent=2))

# Delete a default format mapping
r = requests.delete(f"{BASE_URL}/api/default-formats/png", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 14. API Key Management
# ============================================================================

# List your API keys
r = requests.get(f"{BASE_URL}/api/api-keys", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Create a new API key (the raw key is shown ONLY in this response)
r = requests.post(
    f"{BASE_URL}/api/api-keys",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"name": "CI pipeline"},
)
print(json.dumps(r.json(), indent=2))

# Delete an API key by its ID
API_KEY_ID = "<API_KEY_ID>"
r = requests.delete(f"{BASE_URL}/api/api-keys/{API_KEY_ID}", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 15. List Available Converters
# ============================================================================

# See all registered converters and their supported input/output formats
r = requests.get(f"{BASE_URL}/api/converters", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 16. User Management (admin)
# ============================================================================

# Get the currently authenticated user
r = requests.get(f"{BASE_URL}/api/users/me", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Update your own profile
r = requests.patch(
    f"{BASE_URL}/api/users/me",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"full_name": "Updated Name", "email": "newemail@example.com"},
)
print(json.dumps(r.json(), indent=2))

# List all users (admin only)
r = requests.get(f"{BASE_URL}/api/users", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# Create a new member user (admin only)
r = requests.post(
    f"{BASE_URL}/api/users",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={
        "username": "alice",
        "password": "secure password here",
        "email": "alice@example.com",
        "full_name": "Alice Example",
        "role": "member",
    },
)
print(json.dumps(r.json(), indent=2))

# Update another user (admin only)
USER_UUID = "<USER_UUID>"
r = requests.patch(
    f"{BASE_URL}/api/users/{USER_UUID}",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"role": "admin", "full_name": "Alice Admin"},
)
print(json.dumps(r.json(), indent=2))

# Delete a user (admin only — cannot delete yourself)
r = requests.delete(f"{BASE_URL}/api/users/{USER_UUID}", headers=HEADERS)
print(json.dumps(r.json(), indent=2))

# ============================================================================
# 17. Full Workflow: Upload → Convert → Download
# ============================================================================
# A start-to-finish example that chains commands together.

# Step 1 — Upload a PNG
with open(os.path.join(SAMPLES_DIR, "png.png"), "rb") as f:
    upload_response = requests.post(
        f"{BASE_URL}/api/files", headers=HEADERS, files={"file": f}
    )
upload_data = upload_response.json()
print("Upload response:")
print(json.dumps(upload_data, indent=2))

# Step 2 — Extract the file ID
uploaded_id = upload_data["metadata"]["id"]
print(f"Uploaded file ID: {uploaded_id}")

# Step 3 — Convert PNG to WEBP
convert_response = requests.post(
    f"{BASE_URL}/api/conversions",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"id": uploaded_id, "output_format": "webp"},
)
convert_data = convert_response.json()
print("Conversion response:")
print(json.dumps(convert_data, indent=2))

# Step 4 — Extract the converted file ID
converted_file_id = convert_data["id"]
print(f"Converted file ID: {converted_file_id}")

# Step 5 — Download the converted file
r = requests.get(f"{BASE_URL}/api/files/{converted_file_id}", headers=HEADERS)
with open("converted.webp", "wb") as f:
    f.write(r.content)
print("Downloaded converted file to converted.webp")
