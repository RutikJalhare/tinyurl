#!/bin/bash

# TinyLink Automated API Test Script
# Make sure your server is running at http://localhost:3000

set -e

BASE_URL="http://localhost:3000"
CODE="test123"
TARGET_URL="https://www.google.com"

function print_section() {
  echo -e "\n==== $1 ===="
}

print_section "1. Health Check"
curl -s $BASE_URL/healthz | jq

print_section "2. Create Link (auto code)"
curl -s -X POST $BASE_URL/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://github.com"}' | jq

print_section "3. Create Link (custom code)"
curl -s -X POST $BASE_URL/api/links \
  -H "Content-Type: application/json" \
  -d "{\"targetUrl\": \"$TARGET_URL\", \"code\": \"$CODE\"}" | jq

print_section "4. Duplicate Code (should fail)"
curl -s -X POST $BASE_URL/api/links \
  -H "Content-Type: application/json" \
  -d "{\"targetUrl\": \"$TARGET_URL\", \"code\": \"$CODE\"}" | jq

print_section "5. Get All Links"
curl -s $BASE_URL/api/links | jq

print_section "6. Get Single Link Stats"
curl -s $BASE_URL/api/links/$CODE | jq

print_section "7. Redirect (should be 302)"
curl -I $BASE_URL/$CODE

print_section "8. Delete Link"
curl -s -X DELETE $BASE_URL/api/links/$CODE | jq

print_section "9. Redirect After Deletion (should be 404)"
curl -I $BASE_URL/$CODE

print_section "10. All Tests Completed!"
