# Testing Guide for TinyLink

## Manual Testing Checklist

### 1. Health Check Endpoint ✓

**Test**: GET /healthz

**Expected Response**:
```json
{
  "ok": true,
  "version": "1.0",
  "timestamp": "2025-11-19T...",
  "uptime": 123.45
}
```

**How to Test**:
```bash
curl http://localhost:3000/healthz
```

Or visit: http://localhost:3000/healthz in browser

---

### 2. Create Link (Auto-generated Code) ✓

**Test**: POST /api/links with auto-generated code

**Request**:
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://www.google.com"}'
```

**Expected Response**: Status 201
```json
{
  "id": "...",
  "code": "aBc123",
  "targetUrl": "https://www.google.com",
  "clicks": 0,
  "lastClicked": null,
  "createdAt": "2025-11-19T..."
}
```

**UI Test**:
1. Go to http://localhost:3000
2. Click "+ Add New Link"
3. Enter URL: `https://www.google.com`
4. Leave "Custom Code" empty
5. Click "Create Short Link"
6. Verify link appears in table

---

### 3. Create Link (Custom Code) ✓

**Test**: POST /api/links with custom code

**Request**:
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://github.com", "code": "github"}'
```

**Expected Response**: Status 201

**UI Test**:
1. Click "+ Add New Link"
2. Enter URL: `https://github.com`
3. Enter Custom Code: `github`
4. Click "Create Short Link"
5. Verify link with code "github" appears

---

### 4. Duplicate Code (409 Error) ✓

**Test**: POST /api/links with existing code

**Request**:
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com", "code": "github"}'
```

**Expected Response**: Status 409
```json
{
  "error": "Short code already exists"
}
```

**UI Test**:
1. Try to create a link with code "github" again
2. Should see error: "Short code already exists"

---

### 5. Invalid URL (400 Error) ✓

**Test**: POST /api/links with invalid URL

**Request**:
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "not-a-valid-url"}'
```

**Expected Response**: Status 400
```json
{
  "error": "Invalid URL format"
}
```

**UI Test**:
1. Enter invalid URL: `not-a-url`
2. Should see browser validation error

---

### 6. Invalid Custom Code (400 Error) ✓

**Test**: POST /api/links with invalid code format

**Request**:
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com", "code": "ab"}'
```

**Expected Response**: Status 400
```json
{
  "error": "Code must be 6-8 alphanumeric characters"
}
```

**UI Test**:
1. Enter code: `ab` (too short)
2. Should see error message

---

### 7. Get All Links ✓

**Test**: GET /api/links

**Request**:
```bash
curl http://localhost:3000/api/links
```

**Expected Response**: Status 200
```json
[
  {
    "id": "...",
    "code": "github",
    "targetUrl": "https://github.com",
    "clicks": 0,
    "lastClicked": null,
    "createdAt": "2025-11-19T..."
  },
  ...
]
```

**UI Test**:
- Dashboard should show all created links in a table

---

### 8. Get Single Link Stats ✓

**Test**: GET /api/links/:code

**Request**:
```bash
curl http://localhost:3000/api/links/github
```

**Expected Response**: Status 200
```json
{
  "id": "...",
  "code": "github",
  "targetUrl": "https://github.com",
  "clicks": 0,
  "lastClicked": null,
  "createdAt": "2025-11-19T..."
}
```

**UI Test**:
1. Click "Stats" button for any link
2. Should navigate to /code/github
3. Should show detailed statistics

---

### 9. Redirect Functionality (302) ✓

**Test**: GET /:code

**Request**:
```bash
curl -I http://localhost:3000/github
```

**Expected Response**: Status 302
```
HTTP/1.1 302 Found
Location: https://github.com
...
```

**UI Test**:
1. Open http://localhost:3000/github in browser
2. Should redirect to https://github.com
3. Check dashboard - clicks should increment

---

### 10. Click Tracking ✓

**Test**: Verify clicks are tracked

**Steps**:
1. Note current click count for a link
2. Visit the short URL (e.g., http://localhost:3000/github)
3. Go back to dashboard
4. Verify click count increased by 1
5. Verify "Last Clicked" timestamp is updated

---

### 11. Delete Link ✓

**Test**: DELETE /api/links/:code

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/links/github
```

**Expected Response**: Status 200
```json
{
  "success": true
}
```

**UI Test**:
1. Click "Delete" button for a link
2. Confirm deletion
3. Link should disappear from table

---

### 12. Redirect After Deletion (404) ✓

**Test**: GET /:code after deletion

**Request**:
```bash
curl -I http://localhost:3000/github
```

**Expected Response**: Status 404

**UI Test**:
1. Try to visit a deleted short URL
2. Should see "Not Found" (404 error)

---

### 13. Dashboard Features ✓

**Search/Filter**:
1. Create multiple links
2. Use search box to filter by code or URL
3. Verify filtered results

**Sort**:
1. Change sort dropdown to "Sort by Clicks"
2. Verify links are sorted by click count
3. Change to "Sort by Date"
4. Verify links are sorted by creation date

**Empty State**:
1. Delete all links
2. Should see empty state message
3. Should see "Create your first link" button

---

### 14. Stats Page Features ✓

**Test**: /code/:code page

**Steps**:
1. Navigate to stats page for any link
2. Verify displays:
   - Short URL with copy button
   - Target URL (clickable)
   - Total clicks
   - Last clicked timestamp
   - Created at timestamp
3. Click "Copy" button
4. Verify URL is copied to clipboard
5. Click "Delete Link" button
6. Verify redirects to dashboard after deletion

---

### 15. Responsive Design ✓

**Test**: Mobile/tablet layouts

**Steps**:
1. Open browser dev tools
2. Toggle device emulation
3. Test on:
   - Mobile (375px width)
   - Tablet (768px width)
   - Desktop (1024px+ width)
4. Verify:
   - Table is scrollable on mobile
   - Form is usable
   - Buttons are accessible
   - Text is readable

---

### 16. Loading States ✓

**Test**: UI feedback during async operations

**Steps**:
1. Create a link
2. Verify button shows "Creating..." during submission
3. Verify button is disabled during submission
4. Verify dashboard shows "Loading..." while fetching links

---

### 17. Error States ✓

**Test**: User-friendly error messages

**Steps**:
1. Try to create duplicate code
2. Verify error message is displayed
3. Try invalid URL format
4. Verify error message is displayed
5. Try invalid custom code format
6. Verify error message is displayed

---

## Automated Testing with curl

Run all API tests:

```bash
#!/bin/bash

echo "Testing TinyLink API..."

# 1. Health check
echo "1. Testing health check..."
curl -s http://localhost:3000/healthz | jq

# 2. Create link with auto code
echo "2. Creating link with auto code..."
curl -s -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://www.google.com"}' | jq

# 3. Create link with custom code
echo "3. Creating link with custom code..."
curl -s -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://github.com", "code": "github1"}' | jq

# 4. Test duplicate code (should fail with 409)
echo "4. Testing duplicate code..."
curl -s -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com", "code": "github1"}' | jq

# 5. Get all links
echo "5. Getting all links..."
curl -s http://localhost:3000/api/links | jq

# 6. Get single link
echo "6. Getting single link..."
curl -s http://localhost:3000/api/links/github1 | jq

# 7. Test redirect
echo "7. Testing redirect..."
curl -I http://localhost:3000/github1

# 8. Delete link
echo "8. Deleting link..."
curl -s -X DELETE http://localhost:3000/api/links/github1 | jq

# 9. Test 404 after deletion
echo "9. Testing 404 after deletion..."
curl -I http://localhost:3000/github1

echo "All tests completed!"
```

Save as `test-api.sh` and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Acceptance Criteria Verification

- ✅ `/healthz` returns 200 with `{ok: true, version: "1.0"}`
- ✅ Creating a link works
- ✅ Duplicate codes return 409
- ✅ Redirect works and increments click count
- ✅ Deletion stops redirect (returns 404)
- ✅ Custom codes are 6-8 alphanumeric characters
- ✅ URLs are validated before saving
- ✅ Dashboard shows all links with stats
- ✅ Stats page shows detailed information
- ✅ UI has proper states (loading, error, empty, success)
- ✅ Form validation is inline and user-friendly
- ✅ Design is clean and responsive
- ✅ Search/filter functionality works
- ✅ Copy buttons work

---

## Performance Testing

Test link creation performance:
```bash
# Create 100 links rapidly
for i in {1..100}; do
  curl -s -X POST http://localhost:3000/api/links \
    -H "Content-Type: application/json" \
    -d "{\"targetUrl\": \"https://example.com/page$i\"}" &
done
wait
```

---

## Browser Compatibility

Test on:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Next Steps

After local testing:
1. Deploy to Vercel
2. Update DATABASE_URL to PostgreSQL
3. Run same tests on production URL
4. Monitor for errors in Vercel logs
