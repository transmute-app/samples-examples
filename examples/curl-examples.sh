#!/usr/bin/env bash
# ============================================================================
# Transmute API — curl Examples
# ============================================================================
# Demonstrates every major API endpoint using curl and the sample files
# found in assets/samples/.
#
# Usage:
#   1. Fill in the configuration below.
#   2. Run individual commands by copying them, or source the whole file.
# ============================================================================

# ── Configuration ───────────────────────────────────────────────────────────
# Set your Transmute base URL (no trailing slash)
BASE_URL="http://localhost:3313"

# Set your API key or JWT bearer token here.
# You can obtain one via the authentication or API key endpoints below.
API_KEY="your-api-key-here"

# Shorthand for the Authorization header used by most endpoints.
AUTH="Authorization: Bearer ${API_KEY}"

# Path to sample files (relative to this script's location)
SAMPLES_DIR="$(cd "$(dirname "$0")/../samples" && pwd)"

# ============================================================================
#  1. Health & Readiness (no authentication required)
# ============================================================================

# Application metadata (name & version)
curl -s "${BASE_URL}/api/health/info" | python3 -m json.tool

# Liveness probe
curl -s "${BASE_URL}/api/health/live" | python3 -m json.tool

# Readiness probe (checks database + storage)
curl -s "${BASE_URL}/api/health/ready" | python3 -m json.tool

# ============================================================================
#  2. Bootstrap & User Creation
# ============================================================================

# Check if the application needs its first admin account
curl -s "${BASE_URL}/api/users/bootstrap-status" | python3 -m json.tool

# Create the initial admin user (no auth required when no users exist)
curl -s -X POST "${BASE_URL}/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "correct horse battery staple",
    "email": "admin@example.com",
    "full_name": "Admin User"
  }' | python3 -m json.tool

# ============================================================================
#  3. Authentication
# ============================================================================

# Authenticate with JSON body — returns a JWT access token
curl -s -X POST "${BASE_URL}/api/users/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "correct horse battery staple"
  }' | python3 -m json.tool

# Authenticate via OAuth2 password form (used by Swagger UI / token clients)
curl -s -X POST "${BASE_URL}/api/users/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=correct+horse+battery+staple"  | python3 -m json.tool

# TIP: Capture the token for subsequent requests:
#   TOKEN=$(curl -s -X POST "${BASE_URL}/api/users/authenticate" \
#     -H "Content-Type: application/json" \
#     -d '{"username":"admin","password":"correct horse battery staple"}' \
#     | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
#   AUTH="Authorization: Bearer ${TOKEN}"

# ============================================================================
#  4. Upload Files
# ============================================================================

# Upload a PNG image
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/png.png" | python3 -m json.tool

# Upload a CSV spreadsheet
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/csv.csv" | python3 -m json.tool

# Upload a Markdown document
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/md.md" | python3 -m json.tool

# Upload an SVG image
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/svg.svg" | python3 -m json.tool

# Upload a DOCX document
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/docx.docx" | python3 -m json.tool

# Upload an MP3 audio file
curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/mp3.mp3" | python3 -m json.tool

# ============================================================================
#  5. List Uploaded Files
# ============================================================================

# List all uploaded files (returns IDs, filenames, compatible output formats)
curl -s "${BASE_URL}/api/files" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
#  6. Convert a File
# ============================================================================
# Replace <FILE_ID> with an actual file ID from the upload or list response.

FILE_ID="<FILE_ID>"

# Convert a PNG to WEBP
curl -s -X POST "${BASE_URL}/api/conversions" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"${FILE_ID}\",
    \"output_format\": \"webp\"
  }" | python3 -m json.tool

# Convert a CSV to JSON
# (upload csv.csv first, then use its file ID)
curl -s -X POST "${BASE_URL}/api/conversions" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"${FILE_ID}\",
    \"output_format\": \"json\"
  }" | python3 -m json.tool

# Convert a Markdown file to HTML
# (upload md.md first, then use its file ID)
curl -s -X POST "${BASE_URL}/api/conversions" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"${FILE_ID}\",
    \"output_format\": \"html\"
  }" | python3 -m json.tool

# ============================================================================
#  7. Download a File
# ============================================================================
# Replace <FILE_ID> with an uploaded or converted file ID.

# Download to stdout
curl -s "${BASE_URL}/api/files/${FILE_ID}" \
  -H "${AUTH}" \
  --output downloaded_file.webp

# Save a converted file with a specific name
CONVERTED_ID="<CONVERTED_FILE_ID>"
curl -s "${BASE_URL}/api/files/${CONVERTED_ID}" \
  -H "${AUTH}" \
  --output converted_output.webp

# ============================================================================
#  8. Batch Download (ZIP)
# ============================================================================
# Provide an array of converted file IDs to receive a ZIP archive.

curl -s -X POST "${BASE_URL}/api/files/batch" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "file_ids": ["<CONVERTED_ID_1>", "<CONVERTED_ID_2>"]
  }' --output transmute_batch.zip

# ============================================================================
#  9. List Completed Conversions
# ============================================================================

curl -s "${BASE_URL}/api/conversions/complete" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 10. Delete a Conversion
# ============================================================================

# Delete a single conversion by ID
curl -s -X DELETE "${BASE_URL}/api/conversions/${CONVERTED_ID}" \
  -H "${AUTH}" | python3 -m json.tool

# Delete ALL conversions
curl -s -X DELETE "${BASE_URL}/api/conversions/all" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 11. Delete Files
# ============================================================================

# Delete a single uploaded file
curl -s -X DELETE "${BASE_URL}/api/files/${FILE_ID}" \
  -H "${AUTH}" | python3 -m json.tool

# Delete ALL uploaded files
curl -s -X DELETE "${BASE_URL}/api/files/all" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 12. App Settings
# ============================================================================

# Get current settings
curl -s "${BASE_URL}/api/settings" \
  -H "${AUTH}" | python3 -m json.tool

# Update theme
curl -s -X PATCH "${BASE_URL}/api/settings" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "nigredo"
  }' | python3 -m json.tool

# Disable auto-download and enable keep_originals
curl -s -X PATCH "${BASE_URL}/api/settings" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_download": false,
    "keep_originals": true
  }' | python3 -m json.tool

# Update cleanup settings (admin only)
curl -s -X PATCH "${BASE_URL}/api/settings" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "cleanup_enabled": true,
    "cleanup_ttl_minutes": 120
  }' | python3 -m json.tool

# ============================================================================
# 13. Default Format Mappings
# ============================================================================

# Get all default format mappings
curl -s "${BASE_URL}/api/default-formats" \
  -H "${AUTH}" | python3 -m json.tool

# Set a default: always convert PNG → WEBP
curl -s -X PUT "${BASE_URL}/api/default-formats" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "input_format": "png",
    "output_format": "webp"
  }' | python3 -m json.tool

# Set a default: always convert CSV → JSON
curl -s -X PUT "${BASE_URL}/api/default-formats" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "input_format": "csv",
    "output_format": "json"
  }' | python3 -m json.tool

# Delete a default format mapping
curl -s -X DELETE "${BASE_URL}/api/default-formats/png" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 14. API Key Management
# ============================================================================

# List your API keys
curl -s "${BASE_URL}/api/api-keys" \
  -H "${AUTH}" | python3 -m json.tool

# Create a new API key (the raw key is shown ONLY in this response)
curl -s -X POST "${BASE_URL}/api/api-keys" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CI pipeline"
  }' | python3 -m json.tool

# Delete an API key by its ID
API_KEY_ID="<API_KEY_ID>"
curl -s -X DELETE "${BASE_URL}/api/api-keys/${API_KEY_ID}" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 15. List Available Converters
# ============================================================================

# See all registered converters and their supported input/output formats
curl -s "${BASE_URL}/api/converters" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 16. User Management (admin)
# ============================================================================

# Get the currently authenticated user
curl -s "${BASE_URL}/api/users/me" \
  -H "${AUTH}" | python3 -m json.tool

# Update your own profile
curl -s -X PATCH "${BASE_URL}/api/users/me" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Name",
    "email": "newemail@example.com"
  }' | python3 -m json.tool

# List all users (admin only)
curl -s "${BASE_URL}/api/users" \
  -H "${AUTH}" | python3 -m json.tool

# Create a new member user (admin only)
curl -s -X POST "${BASE_URL}/api/users" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "secure password here",
    "email": "alice@example.com",
    "full_name": "Alice Example",
    "role": "member"
  }' | python3 -m json.tool

# Update another user (admin only)
USER_UUID="<USER_UUID>"
curl -s -X PATCH "${BASE_URL}/api/users/${USER_UUID}" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "full_name": "Alice Admin"
  }' | python3 -m json.tool

# Delete a user (admin only — cannot delete yourself)
curl -s -X DELETE "${BASE_URL}/api/users/${USER_UUID}" \
  -H "${AUTH}" | python3 -m json.tool

# ============================================================================
# 17. Full Workflow: Upload → Convert → Download
# ============================================================================
# A start-to-finish example that chains commands together.

# Step 1 — Upload a PNG
UPLOAD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/files" \
  -H "${AUTH}" \
  -F "file=@${SAMPLES_DIR}/png.png")
echo "Upload response:"
echo "${UPLOAD_RESPONSE}" | python3 -m json.tool

# Step 2 — Extract the file ID
UPLOADED_ID=$(echo "${UPLOAD_RESPONSE}" | python3 -c "import sys,json; print(json.load(sys.stdin)['metadata']['id'])")
echo "Uploaded file ID: ${UPLOADED_ID}"

# Step 3 — Convert PNG to WEBP
CONVERT_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/conversions" \
  -H "${AUTH}" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"${UPLOADED_ID}\", \"output_format\": \"webp\"}")
echo "Conversion response:"
echo "${CONVERT_RESPONSE}" | python3 -m json.tool

# Step 4 — Extract the converted file ID
CONVERTED_FILE_ID=$(echo "${CONVERT_RESPONSE}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "Converted file ID: ${CONVERTED_FILE_ID}"

# Step 5 — Download the converted file
curl -s "${BASE_URL}/api/files/${CONVERTED_FILE_ID}" \
  -H "${AUTH}" \
  --output "converted.webp"
echo "Downloaded converted file to converted.webp"
