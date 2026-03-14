// ============================================================================
// Transmute API — JavaScript (fetch) Examples
// ============================================================================
// Demonstrates every major API endpoint using the Fetch API and the sample
// files found in assets/samples/.
//
// Usage:
//   1. Node.js 18+ (has built-in fetch) or install node-fetch.
//   2. Fill in the configuration below.
//   3. Run with: node fetch-examples.js
// ============================================================================

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Configuration ───────────────────────────────────────────────────────────
// Set your Transmute base URL (no trailing slash)
const BASE_URL = "http://localhost:3313";

// Set your API key or JWT bearer token here.
// You can obtain one via the authentication or API key endpoints below.
const API_KEY = "your-api-key-here";

// Shorthand for the Authorization header used by most endpoints.
const AUTH_HEADERS = { Authorization: `Bearer ${API_KEY}` };

// Path to sample files (relative to this script's location)
const SAMPLES_DIR = resolve(__dirname, "..", "samples");

// Helper: pretty-print JSON responses
async function printJson(response) {
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

// ============================================================================
//  1. Health & Readiness (no authentication required)
// ============================================================================

// Application metadata (name & version)
await printJson(await fetch(`${BASE_URL}/api/health/info`));

// Liveness probe
await printJson(await fetch(`${BASE_URL}/api/health/live`));

// Readiness probe (checks database + storage)
await printJson(await fetch(`${BASE_URL}/api/health/ready`));

// ============================================================================
//  2. Bootstrap & User Creation
// ============================================================================

// Check if the application needs its first admin account
await printJson(await fetch(`${BASE_URL}/api/users/bootstrap-status`));

// Create the initial admin user (no auth required when no users exist)
await printJson(
  await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin",
      password: "correct horse battery staple",
      email: "admin@example.com",
      full_name: "Admin User",
    }),
  })
);

// ============================================================================
//  3. Authentication
// ============================================================================

// Authenticate with JSON body — returns a JWT access token
await printJson(
  await fetch(`${BASE_URL}/api/users/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin",
      password: "correct horse battery staple",
    }),
  })
);

// Authenticate via OAuth2 password form (used by Swagger UI / token clients)
await printJson(
  await fetch(`${BASE_URL}/api/users/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: "admin",
      password: "correct horse battery staple",
    }),
  })
);

// TIP: Capture the token for subsequent requests:
//   const r = await fetch(`${BASE_URL}/api/users/authenticate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username: "admin", password: "correct horse battery staple" }),
//   });
//   const { access_token } = await r.json();
//   const AUTH_HEADERS = { Authorization: `Bearer ${access_token}` };

// ============================================================================
//  4. Upload Files
// ============================================================================

// Helper: upload a file by path
async function uploadFile(filePath) {
  const fileData = await readFile(filePath);
  const fileName = filePath.split("/").pop();
  const formData = new FormData();
  formData.append("file", new Blob([fileData]), fileName);
  return fetch(`${BASE_URL}/api/files`, {
    method: "POST",
    headers: { ...AUTH_HEADERS },
    body: formData,
  });
}

// Upload a PNG image
await printJson(await uploadFile(resolve(SAMPLES_DIR, "png.png")));

// Upload a CSV spreadsheet
await printJson(await uploadFile(resolve(SAMPLES_DIR, "csv.csv")));

// Upload a Markdown document
await printJson(await uploadFile(resolve(SAMPLES_DIR, "md.md")));

// Upload an SVG image
await printJson(await uploadFile(resolve(SAMPLES_DIR, "svg.svg")));

// Upload a DOCX document
await printJson(await uploadFile(resolve(SAMPLES_DIR, "docx.docx")));

// Upload an MP3 audio file
await printJson(await uploadFile(resolve(SAMPLES_DIR, "mp3.mp3")));

// ============================================================================
//  5. List Uploaded Files
// ============================================================================

// List all uploaded files (returns IDs, filenames, compatible output formats)
await printJson(
  await fetch(`${BASE_URL}/api/files`, { headers: AUTH_HEADERS })
);

// ============================================================================
//  6. Convert a File
// ============================================================================
// Replace <FILE_ID> with an actual file ID from the upload or list response.

const FILE_ID = "<FILE_ID>";

// Convert a PNG to WEBP
await printJson(
  await fetch(`${BASE_URL}/api/conversions`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ id: FILE_ID, output_format: "webp" }),
  })
);

// Convert a CSV to JSON
// (upload csv.csv first, then use its file ID)
await printJson(
  await fetch(`${BASE_URL}/api/conversions`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ id: FILE_ID, output_format: "json" }),
  })
);

// Convert a Markdown file to HTML
// (upload md.md first, then use its file ID)
await printJson(
  await fetch(`${BASE_URL}/api/conversions`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ id: FILE_ID, output_format: "html" }),
  })
);

// ============================================================================
//  7. Download a File
// ============================================================================
// Replace <FILE_ID> with an uploaded or converted file ID.

// Download to a file
let r = await fetch(`${BASE_URL}/api/files/${FILE_ID}`, {
  headers: AUTH_HEADERS,
});
await writeFile("downloaded_file.webp", Buffer.from(await r.arrayBuffer()));

// Save a converted file with a specific name
const CONVERTED_ID = "<CONVERTED_FILE_ID>";
r = await fetch(`${BASE_URL}/api/files/${CONVERTED_ID}`, {
  headers: AUTH_HEADERS,
});
await writeFile("converted_output.webp", Buffer.from(await r.arrayBuffer()));

// ============================================================================
//  8. Batch Download (ZIP)
// ============================================================================
// Provide an array of converted file IDs to receive a ZIP archive.

r = await fetch(`${BASE_URL}/api/files/batch`, {
  method: "POST",
  headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
  body: JSON.stringify({
    file_ids: ["<CONVERTED_ID_1>", "<CONVERTED_ID_2>"],
  }),
});
await writeFile("transmute_batch.zip", Buffer.from(await r.arrayBuffer()));

// ============================================================================
//  9. List Completed Conversions
// ============================================================================

await printJson(
  await fetch(`${BASE_URL}/api/conversions/complete`, { headers: AUTH_HEADERS })
);

// ============================================================================
// 10. Delete a Conversion
// ============================================================================

// Delete a single conversion by ID
await printJson(
  await fetch(`${BASE_URL}/api/conversions/${CONVERTED_ID}`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// Delete ALL conversions
await printJson(
  await fetch(`${BASE_URL}/api/conversions/all`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// ============================================================================
// 11. Delete Files
// ============================================================================

// Delete a single uploaded file
await printJson(
  await fetch(`${BASE_URL}/api/files/${FILE_ID}`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// Delete ALL uploaded files
await printJson(
  await fetch(`${BASE_URL}/api/files/all`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// ============================================================================
// 12. App Settings
// ============================================================================

// Get current settings
await printJson(
  await fetch(`${BASE_URL}/api/settings`, { headers: AUTH_HEADERS })
);

// Update theme
await printJson(
  await fetch(`${BASE_URL}/api/settings`, {
    method: "PATCH",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ theme: "nigredo" }),
  })
);

// Disable auto-download and enable keep_originals
await printJson(
  await fetch(`${BASE_URL}/api/settings`, {
    method: "PATCH",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ auto_download: false, keep_originals: true }),
  })
);

// Update cleanup settings (admin only)
await printJson(
  await fetch(`${BASE_URL}/api/settings`, {
    method: "PATCH",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ cleanup_enabled: true, cleanup_ttl_minutes: 120 }),
  })
);

// ============================================================================
// 13. Default Format Mappings
// ============================================================================

// Get all default format mappings
await printJson(
  await fetch(`${BASE_URL}/api/default-formats`, { headers: AUTH_HEADERS })
);

// Set a default: always convert PNG → WEBP
await printJson(
  await fetch(`${BASE_URL}/api/default-formats`, {
    method: "PUT",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ input_format: "png", output_format: "webp" }),
  })
);

// Set a default: always convert CSV → JSON
await printJson(
  await fetch(`${BASE_URL}/api/default-formats`, {
    method: "PUT",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ input_format: "csv", output_format: "json" }),
  })
);

// Delete a default format mapping
await printJson(
  await fetch(`${BASE_URL}/api/default-formats/png`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// ============================================================================
// 14. API Key Management
// ============================================================================

// List your API keys
await printJson(
  await fetch(`${BASE_URL}/api/api-keys`, { headers: AUTH_HEADERS })
);

// Create a new API key (the raw key is shown ONLY in this response)
await printJson(
  await fetch(`${BASE_URL}/api/api-keys`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "CI pipeline" }),
  })
);

// Delete an API key by its ID
const API_KEY_ID = "<API_KEY_ID>";
await printJson(
  await fetch(`${BASE_URL}/api/api-keys/${API_KEY_ID}`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// ============================================================================
// 15. List Available Converters
// ============================================================================

// See all registered converters and their supported input/output formats
await printJson(
  await fetch(`${BASE_URL}/api/converters`, { headers: AUTH_HEADERS })
);

// ============================================================================
// 16. User Management (admin)
// ============================================================================

// Get the currently authenticated user
await printJson(
  await fetch(`${BASE_URL}/api/users/me`, { headers: AUTH_HEADERS })
);

// Update your own profile
await printJson(
  await fetch(`${BASE_URL}/api/users/me`, {
    method: "PATCH",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Updated Name",
      email: "newemail@example.com",
    }),
  })
);

// List all users (admin only)
await printJson(
  await fetch(`${BASE_URL}/api/users`, { headers: AUTH_HEADERS })
);

// Create a new member user (admin only)
await printJson(
  await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "alice",
      password: "secure password here",
      email: "alice@example.com",
      full_name: "Alice Example",
      role: "member",
    }),
  })
);

// Update another user (admin only)
const USER_UUID = "<USER_UUID>";
await printJson(
  await fetch(`${BASE_URL}/api/users/${USER_UUID}`, {
    method: "PATCH",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin", full_name: "Alice Admin" }),
  })
);

// Delete a user (admin only — cannot delete yourself)
await printJson(
  await fetch(`${BASE_URL}/api/users/${USER_UUID}`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
  })
);

// ============================================================================
// 17. Full Workflow: Upload → Convert → Download
// ============================================================================
// A start-to-finish example that chains commands together.

// Step 1 — Upload a PNG
const pngData = await readFile(resolve(SAMPLES_DIR, "png.png"));
const uploadForm = new FormData();
uploadForm.append("file", new Blob([pngData]), "png.png");
const uploadResponse = await fetch(`${BASE_URL}/api/files`, {
  method: "POST",
  headers: { ...AUTH_HEADERS },
  body: uploadForm,
});
const uploadData = await uploadResponse.json();
console.log("Upload response:");
console.log(JSON.stringify(uploadData, null, 2));

// Step 2 — Extract the file ID
const uploadedId = uploadData.metadata.id;
console.log(`Uploaded file ID: ${uploadedId}`);

// Step 3 — Convert PNG to WEBP
const convertResponse = await fetch(`${BASE_URL}/api/conversions`, {
  method: "POST",
  headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
  body: JSON.stringify({ id: uploadedId, output_format: "webp" }),
});
const convertData = await convertResponse.json();
console.log("Conversion response:");
console.log(JSON.stringify(convertData, null, 2));

// Step 4 — Extract the converted file ID
const convertedFileId = convertData.id;
console.log(`Converted file ID: ${convertedFileId}`);

// Step 5 — Download the converted file
const downloadResponse = await fetch(
  `${BASE_URL}/api/files/${convertedFileId}`,
  { headers: AUTH_HEADERS }
);
await writeFile("converted.webp", Buffer.from(await downloadResponse.arrayBuffer()));
console.log("Downloaded converted file to converted.webp");
