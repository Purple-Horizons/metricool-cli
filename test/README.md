# Metricool CLI Tests

Comprehensive test suite for the Metricool CLI using Node.js built-in test runner (`node:test` + `node:assert`).

## Running Tests

```bash
npm test
```

## Test Coverage

### Unit Tests (Mocked API)
- ✅ **addAuthParams** - Correctly appends auth params, handles URLs with existing `?` params
- ✅ **Network parsing** - Converts comma-separated networks to `[{"network":"linkedin"}]` objects
- ✅ **Media array parsing** - Parses comma-separated media URLs into array
- ✅ **Date handling** - User dates passed as-is (no UTC conversion), auto-generated dates in ISO format
- ✅ **Post body construction** - All fields (text, media, providers, linkedinData, instagramData, draft, firstCommentText)
- ✅ **Blog ID fallback** - --blog-id flag > env var priority
- ✅ **Missing auth credentials** - Error handling for missing credentials

### Integration Tests (Real API Calls)
**Note:** These require environment variables:
- `METRICOOL_USER_TOKEN`
- `METRICOOL_USER_ID`
- `METRICOOL_BLOG_ID`

Tests gracefully skip if env vars are missing.

- ✅ **brands** - Returns array of brands
- ✅ **post list** - Returns scheduled posts
- ✅ **post create --draft + delete** - Creates a draft, verifies it exists, deletes it
- ✅ **analytics posts linkedin** - Returns analytics data
- ✅ **best-time** - Returns best time to publish data
- ✅ **media normalize** - Normalizes external image URL

### CLI Argument Parsing Tests
- ✅ **--blog-id** override works
- ✅ **--network linkedin,instagram** splits correctly
- ✅ **--draft** flag sets draft:true
- ✅ **--first-comment** passes through
- ✅ Missing required args show helpful errors

## Test Structure

```
test/
├── metricool.test.js    # All tests
└── README.md            # This file
```

## Architecture Notes

- **Unit tests** mock the API to avoid real calls (logic-only testing)
- **Integration tests** make real API calls but gracefully handle failures (API might change, permissions might differ)
- **CLI tests** verify argument parsing logic

## Continuous Integration

All tests run on every commit. Integration tests that fail due to API changes/permissions log warnings but don't fail the build.
