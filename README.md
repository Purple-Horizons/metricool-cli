# Metricool CLI

Full-featured command-line interface for the Metricool API.

## Installation

```bash
npm install
npm link  # Make globally available
```

## Configuration

Create a `.env` file in the CLI directory:

```env
METRICOOL_USER_TOKEN=your_user_token_here
METRICOOL_USER_ID=your_user_id_here
METRICOOL_BLOG_ID=your_default_blog_id_here
```

Get your credentials from Metricool account settings.

## Usage

All commands support:
- `--blog-id <id>` — Override default blog ID
- `--json` or `-j` — Output as JSON (default)

### Brands & Admin

```bash
# List all brands
metricool brands

# Get best time to publish
metricool best-time --blog-id 4846146
```

### Posts

```bash
# List scheduled posts
metricool post list --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59

# Create a new post
metricool post create \
  --text "Hello LinkedIn!" \
  --network linkedin \
  --date "2026-02-16T15:00:00" \
  --timezone "America/New_York"

# Create with media
metricool post create \
  --text "Check this out!" \
  --network instagram,facebook \
  --media "https://example.com/image1.jpg,https://example.com/image2.jpg"

# Update a post
metricool post update POST_ID --text "Updated text"

# Delete a post
metricool post delete POST_ID

# Post notes
metricool post notes --post-id POST_ID
metricool post notes --post-id POST_ID --note "Needs review"

# Approval workflow
metricool post approve --post-id POST_ID --status approved --comment "Looks good!"
metricool post tasks --status pending
```

### Analytics (Highest Priority)

```bash
# Time series for any metric
metricool analytics timeline \
  --metric followers \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Distribution data
metricool analytics distribution \
  --metric engagement \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Aggregated metrics
metricool analytics aggregation \
  --metric reach \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Posts analytics by network
metricool analytics posts linkedin \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59 \
  --sort engagement \
  --order desc

# Supported networks: instagram, linkedin, twitter, facebook, tiktok, threads, bluesky, pinterest

# Reels analytics
metricool analytics reels instagram \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Stories analytics
metricool analytics stories instagram \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Hashtag analytics
metricool analytics hashtags \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59
```

### Competitors

```bash
# List competitors for a network
metricool competitors list instagram

# Add a competitor
metricool competitors add instagram --username competitor_handle

# Remove a competitor
metricool competitors remove instagram --id COMPETITOR_ID

# Get competitor posts
metricool competitors posts instagram \
  --id COMPETITOR_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Competitor timeline metrics
metricool competitors timelines \
  --metric followers \
  --competitor-id COMPETITOR_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59
```

### Inbox / Conversations

```bash
# List conversations
metricool inbox list --network instagram --status unread

# Reply to conversation
metricool inbox reply \
  --conversation-id CONV_ID \
  --message "Thanks for reaching out!"

# List post comments
metricool inbox comments --network facebook --post-id POST_ID

# Reply to comment
metricool inbox comment-reply \
  --comment-id COMMENT_ID \
  --message "Thank you!"

# List reviews
metricool inbox reviews --network google

# Reply to review
metricool inbox review-reply \
  --review-id REVIEW_ID \
  --message "We appreciate your feedback!"
```

### Smart Links (Link in Bio)

```bash
# List smart links
metricool smartlinks list

# Create a smart link
metricool smartlinks create \
  --title "My Website" \
  --url "https://example.com" \
  --description "Check out my site"

# Update a smart link
metricool smartlinks update \
  --id LINK_ID \
  --title "Updated Title" \
  --url "https://newurl.com"

# Delete a smart link
metricool smartlinks delete --id LINK_ID

# Get smart link analytics
metricool smartlinks analytics \
  --id LINK_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59
```

### AI Features

```bash
# Generate post copy
metricool ai generate \
  --prompt "Write a LinkedIn post about AI in marketing" \
  --language en \
  --tone professional \
  --network linkedin

# Regenerate post
metricool ai regenerate \
  --post-id POST_ID \
  --tone casual

# Quick actions (shorten, lengthen, rephrase, etc.)
metricool ai quick-action \
  --text "This is my post text that needs to be shortened" \
  --action shorten \
  --language en

# Natural language scheduling
metricool ai schedule \
  --text "tomorrow at 3pm" \
  --timezone "America/New_York"

# Check scheduling job status
metricool ai schedule-status --job-id JOB_ID

# List available languages
metricool ai languages
```

### Post Library

```bash
# List library posts
metricool library list --limit 50 --offset 0

# Create library post
metricool library create \
  --text "Reusable post content" \
  --media "https://example.com/image.jpg"

# Update library post
metricool library update \
  --id POST_ID \
  --text "Updated content"

# Delete library post
metricool library delete --id POST_ID
```

### Hashtag Tracker

```bash
# List tracked hashtags
metricool hashtags list

# Track a new hashtag
metricool hashtags create --hashtag marketing

# Get hashtag statistics
metricool hashtags stats \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59
```

### Reports

```bash
# List reports
metricool reports list

# Get report status
metricool reports status --report-id REPORT_ID

# Get report configuration
metricool reports config

# Set report configuration
metricool reports config --set '{"key": "value"}'
```

### Brand/Account Management

```bash
# Get brand info
metricool brand info

# Update brand
metricool brand update \
  --name "New Brand Name" \
  --timezone "Europe/Madrid"

# List network connections
metricool brand connections

# Get brand images
metricool brand images

# User info
metricool user

# Subscription info
metricool subscription
```

### Advertising

```bash
# List ad campaigns
metricool ads campaigns

# List ad groups
metricool ads groups --campaign-id CAMPAIGN_ID

# List ads
metricool ads list --ad-group-id AD_GROUP_ID

# List keywords
metricool ads keywords --ad-group-id AD_GROUP_ID
```

### Performance Dashboards

```bash
# List dashboards
metricool dashboard list

# Create dashboard
metricool dashboard create \
  --name "Q1 2026 Performance" \
  --description "First quarter metrics"

# Get dashboard analytics
metricool dashboard analytics \
  --dashboard-id DASH_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Sync dashboard
metricool dashboard sync --dashboard-id DASH_ID
```

### Media

```bash
# List images
metricool media images --limit 50

# List videos
metricool media videos --limit 50

# Upload media
metricool media upload \
  --url "https://example.com/image.jpg" \
  --filename "my-image.jpg" \
  --content-type "image/jpeg"

# Normalize external image URL
metricool media normalize "https://external.com/image.jpg"
```

### Calendars

```bash
# List calendars
metricool calendar list

# List calendar events
metricool calendar events \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-28T23:59:59

# Create calendar
metricool calendar create \
  --name "Content Calendar" \
  --description "Monthly content schedule"
```

### Misc Utilities

```bash
# Search GIFs
metricool gif --query "funny cat" --limit 10 --rating g

# Get trending GIFs
metricool gif --limit 20

# Account suggestions
metricool suggestions twitter --query "marketing"
metricool suggestions linkedin --query "tech companies"

# Scheduler counters
metricool counters

# Health check
metricool ping
```

## Date Handling

**IMPORTANT:** Dates are passed as-is to the API. When you specify:

```bash
--date "2026-02-16T11:45:00" --timezone "America/New_York"
```

The CLI will send `"2026-02-16T11:45:00"` with `timezone: "America/New_York"` exactly as provided. The date is **not** converted to UTC.

## Examples

### Daily Workflow

```bash
# Check scheduled posts for today
metricool post list --start 2026-02-16T00:00:00 --end 2026-02-16T23:59:59

# Create a LinkedIn post for 3pm today
metricool post create \
  --text "Excited to share our latest insights on AI in marketing!" \
  --network linkedin \
  --date "2026-02-16T15:00:00" \
  --timezone "America/New_York"

# Check LinkedIn post performance for the last 2 weeks
metricool analytics posts linkedin \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59 \
  --sort engagement \
  --order desc
```

### Competitor Analysis

```bash
# Add competitors
metricool competitors add instagram --username competitor1
metricool competitors add instagram --username competitor2

# Track their posts
metricool competitors posts instagram \
  --id COMPETITOR_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59

# Compare follower growth
metricool competitors timelines \
  --metric followers \
  --competitor-id COMPETITOR_ID \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59
```

### AI-Powered Content Creation

```bash
# Generate LinkedIn post
metricool ai generate \
  --prompt "Write about the benefits of social media scheduling tools" \
  --language en \
  --tone professional \
  --network linkedin

# Shorten existing text
metricool ai quick-action \
  --text "This is a very long piece of text that needs to be more concise for social media posting" \
  --action shorten

# Schedule using natural language
metricool ai schedule --text "next Monday at 9am"
```

## Tips

- Use `--json` for scripting and automation
- Set `METRICOOL_BLOG_ID` in `.env` to avoid typing `--blog-id` every time
- All dates should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`
- Combine commands with `jq` for powerful data processing:
  ```bash
  metricool analytics posts linkedin --start 2026-02-01 --end 2026-02-16 | jq '.posts | sort_by(.engagement)'
  ```

## Error Handling

- Check API error messages in the console output
- Verify your credentials in `.env`
- Ensure blog ID is valid
- Dates must be in correct format

## Contributing

Issues and PRs welcome!

## License

MIT
