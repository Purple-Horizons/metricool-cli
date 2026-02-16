# Metricool CLI

A comprehensive command-line tool for managing Metricool social media posts and analytics.

## Installation

```bash
cd /path/to/metricool-cli
npm install
npm link
```

## Configuration

Set the following environment variables (or add to `.env` file):

```bash
METRICOOL_USER_TOKEN=your_user_token
METRICOOL_USER_ID=your_user_id
METRICOOL_BLOG_ID=your_default_blog_id
```

Find your credentials:
- **userToken**: Account Settings → API Token
- **userId**: Your Metricool user ID
- **blogId**: Brand ID (visible in browser URL when viewing a brand)

## Commands

### List Brands

Get all brands/profiles in your Metricool account:

```bash
metricool brands
```

### Best Time to Post

Get the recommended best time to publish:

```bash
metricool best-time
metricool best-time --blog-id 12345
```

### Post Management

#### List Posts

List scheduled posts within a date range:

```bash
metricool post list --start "2026-02-17T00:00:00" --end "2026-02-18T23:59:59"
metricool post list --start "2026-02-17T00:00:00" --end "2026-02-20T00:00:00" --timezone "America/New_York"
```

#### Create Post

Create a new scheduled post:

```bash
# Simple text post to LinkedIn
metricool post create \
  --text "Hello world!" \
  --network linkedin \
  --date "2026-02-17T12:00:00"

# Multi-network post with image
metricool post create \
  --text "Check out our new product!" \
  --network linkedin,instagram,twitter \
  --media "https://example.com/image.jpg" \
  --date "2026-02-17T15:00:00"

# Instagram Reel with first comment
metricool post create \
  --text "Amazing video!" \
  --network instagram \
  --media "https://example.com/video.mp4" \
  --instagram-type REEL \
  --first-comment "Link in bio 👆" \
  --date "2026-02-17T18:00:00"

# Draft post
metricool post create \
  --text "Draft content here" \
  --network linkedin \
  --draft

# LinkedIn poll
metricool post create \
  --text "What's your favorite?" \
  --network linkedin \
  --linkedin-type poll \
  --date "2026-02-17T10:00:00"
```

**Important:** The `--network` parameter accepts comma-separated values that are converted to provider objects internally. Available networks:
- `linkedin`
- `instagram`
- `twitter`
- `facebook`
- `tiktok`
- `youtube`
- `threads`
- `bluesky`

#### Update Post

Update an existing scheduled post:

```bash
metricool post update 123456 --text "Updated content"
metricool post update 123456 --date "2026-02-18T12:00:00"
metricool post update 123456 --network linkedin,instagram
```

#### Delete Post

Delete a scheduled post:

```bash
metricool post delete 123456
```

### Network Statistics

Get analytics for a specific network:

```bash
metricool stats instagram
metricool stats linkedin
metricool stats twitter
metricool stats facebook
metricool stats tiktok
metricool stats youtube
```

### Media Management

#### Normalize Image URL

Convert an external image URL to a Metricool-hosted URL (critical for posting images from external sources like fal.ai):

```bash
metricool media normalize "https://fal.ai/files/image.jpg"
```

This validates that the URL is publicly accessible and transforms it into a Metricool repository URL that can be used in posts.

#### Upload Media

Create an S3 upload transaction:

```bash
metricool media upload --url "https://example.com/image.jpg" --filename "myimage.jpg"
```

## Examples

### Workflow: Post an AI-Generated Image

1. Generate image with fal.ai (or any external service)
2. Normalize the URL to Metricool format:
   ```bash
   NORMALIZED_URL=$(metricool media normalize "https://fal.ai/files/abc123.jpg")
   ```
3. Create post with normalized URL:
   ```bash
   metricool post create \
     --text "Check out this AI-generated artwork!" \
     --network instagram,linkedin \
     --media "$NORMALIZED_URL" \
     --date "2026-02-17T14:00:00"
   ```

### Schedule Week's Content

```bash
# Monday motivation
metricool post create \
  --text "Start your week strong! 💪" \
  --network linkedin,instagram \
  --date "2026-02-17T09:00:00"

# Wednesday tip
metricool post create \
  --text "Pro tip: Always normalize external image URLs before posting!" \
  --network linkedin,twitter \
  --date "2026-02-19T12:00:00"

# Friday celebration
metricool post create \
  --text "Happy Friday! 🎉" \
  --network instagram \
  --instagram-type STORY \
  --media "https://example.com/celebration.jpg" \
  --date "2026-02-21T17:00:00"
```

## API Details

### Base URL
```
https://app.metricool.com/api
```

### Authentication

All requests include these parameters:
- `userToken` (query param or `X-Mc-Auth` header)
- `userId` (query param)
- `blogId` (query param)

### Key Endpoints Used

- `GET /admin/simpleProfiles` - List brands
- `GET /planner/best-time-to-publish` - Best posting time
- `GET /v2/scheduler/posts` - List scheduled posts
- `POST /v2/scheduler/posts` - Create post
- `PUT /v2/scheduler/posts/{id}` - Update post
- `DELETE /v2/scheduler/posts/{id}` - Delete post
- `GET /v2/analytics/{network}/profile` - Network stats
- `GET /actions/normalize/image/url` - Normalize image URL
- `PUT /v2/media/s3/upload-transactions` - Upload media

### Provider Format (Critical!)

The Metricool API expects `providers` as an **array of objects**, not strings:

✅ **Correct:**
```json
{
  "providers": [
    { "network": "linkedin" },
    { "network": "instagram" }
  ]
}
```

❌ **Wrong:**
```json
{
  "providers": ["linkedin", "instagram"]
}
```

The CLI handles this conversion automatically when you use `--network linkedin,instagram`.

## Troubleshooting

**"blogId required" error:**
- Set `METRICOOL_BLOG_ID` environment variable
- Or pass `--blog-id` to each command

**"API request failed: 401":**
- Check your `METRICOOL_USER_TOKEN` and `METRICOOL_USER_ID`
- Verify credentials in Metricool account settings

**Post creation fails:**
- Make sure date is in ISO 8601 format: `2026-02-17T12:00:00`
- Verify timezone format: `America/New_York`
- For external images, use `media normalize` first

**Media URLs not working:**
- Always normalize external image URLs before using them in posts
- Use `metricool media normalize <url>` first

## License

MIT

## Author

Built by Purple Horizons for the OpenClaw ecosystem.
