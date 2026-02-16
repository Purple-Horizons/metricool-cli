# Metricool CLI - Quick Start

## Installation

```bash
npm install
npm link
```

## Configuration

The CLI looks for credentials in:
1. Environment variables
2. `.env` file in the CLI directory

```bash
METRICOOL_USER_TOKEN=your_token
METRICOOL_USER_ID=your_user_id
METRICOOL_BLOG_ID=default_blog_id
```

## Quick Test

```bash
# List all brands (verify auth)
metricool brands

# Create a draft post
metricool post create \
  --text "Hello from CLI!" \
  --network instagram \
  --draft
```

## Common Commands

```bash
# List brands
metricool brands

# Create Instagram post
metricool post create \
  --text "Post content" \
  --network instagram \
  --instagram-type POST \
  --date "2026-02-17T12:00:00"

# Create multi-network post
metricool post create \
  --text "Cross-post!" \
  --network linkedin,instagram,twitter \
  --date "2026-02-17T15:00:00"

# Normalize external image
metricool media normalize "https://fal.ai/files/image.jpg"

# List scheduled posts
metricool post list \
  --start "2026-02-17T00:00:00" \
  --end "2026-02-20T00:00:00"

# Get network stats
metricool stats instagram
```

## Key Notes

1. **Provider Format**: Automatically converts `--network linkedin,instagram` to proper API format `[{"network":"linkedin"},{"network":"instagram"}]`

2. **Date Format**: Accepts ISO 8601 format `2026-02-17T12:00:00`

3. **Media URLs**: For external images (fal.ai, etc.), use `media normalize` first to convert to Metricool-hosted URLs

4. **Draft Mode**: Use `--draft` flag to create posts without auto-publishing

5. **Blog ID**: Can override default with `--blog-id` on any command

## Testing

The CLI was successfully tested with:
- ✅ `metricool brands` - Listed all brands
- ✅ `metricool post create` - Created draft Instagram post (ID: 294341000)

## Troubleshooting

- **401 Error**: Check credentials in `.env`
- **400 Date Error**: Date must be `yyyy-MM-dd'T'HH:mm:ss` format
- **blogId required**: Set `METRICOOL_BLOG_ID` or use `--blog-id`
