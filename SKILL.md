---
name: metricool
description: Manage social media through the Metricool CLI — create and schedule posts, pull analytics, check what's performing, manage inbox and conversations, track competitors, use AI to generate content, and handle multi-network publishing. Use this skill whenever the user mentions social media, posting, scheduling content, checking engagement or followers, reviewing DMs/comments, content calendars, or anything related to their social media presence — even if they don't say "Metricool" explicitly. Also trigger for requests like "what did we get in views", "draft a post", "schedule something for tomorrow", "how's our LinkedIn doing", or "check our Instagram stats".
---

# Metricool Social Media Management

You have access to the `metricool` CLI which connects to the Metricool API. This is a powerful tool for managing social media across all major networks from the terminal.

## How it works

The CLI is installed globally as `metricool`. All commands output JSON. Auth is handled via environment variables (already configured). The default brand is set via `METRICOOL_BLOG_ID`.

Networks supported: Instagram, LinkedIn, Twitter/X, Facebook, TikTok, Threads, Bluesky, Pinterest, YouTube.

## Core workflows

### Creating and scheduling posts

The typical flow is: draft content, review it, then either schedule or publish.

```bash
# Create a draft post (won't go live until approved)
metricool post create --text "Your content here" --network linkedin,instagram --draft

# Create a scheduled post (goes live at the specified time)
metricool post create --text "Content" --network linkedin --date "2026-03-05T14:00:00" --timezone "America/New_York"

# Multi-network post with media
metricool post create --text "Check this out" --network linkedin,instagram,twitter,facebook --media "https://example.com/image.jpg" --date "2026-03-06T10:00:00" --timezone "America/New_York"
```

**Important options for post create:**
- `--network` — comma-separated: `linkedin,instagram,twitter,facebook,tiktok,threads,bluesky,pinterest`
- `--date` — ISO format datetime, always pair with `--timezone`
- `--timezone` — e.g. "America/New_York" (defaults to this if omitted)
- `--draft` — creates as draft, won't auto-publish
- `--media` — comma-separated image/video URLs
- `--first-comment` — adds a first comment (useful for Instagram hashtags)
- `--linkedin-type` — LinkedIn post type
- `--instagram-type` — Instagram post type (reel, story, etc.)

**After creating a draft**, the user may want to review and approve:
```bash
metricool post approve --post-id POST_ID --approved true
metricool post notes --post-id POST_ID --note "Looks good, approved"
```

**Check best posting times** before scheduling:
```bash
metricool best-time
```

**Workflow tip**: When the user says "draft a post", default to `--draft` so they can review it in Metricool before it goes live. Show them the post ID so they can find it in the planner. Only skip `--draft` if they explicitly say "post it now" or "schedule it".

### Checking analytics and performance

When the user wants to know how their content is doing, pull the relevant analytics. Think about what they're actually asking — "how are we doing on LinkedIn" probably means recent post performance + follower trends.

```bash
# See how posts performed on a specific network
metricool analytics posts linkedin --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59

# Follower growth over time
metricool analytics timeline --metric followers --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59

# Engagement, impressions, reach aggregations
metricool analytics aggregation --metric engagement --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59

# Content-type specific analytics
metricool analytics reels instagram --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59
metricool analytics stories instagram --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59

# Distribution (geographic, source, etc.)
metricool analytics distribution --metric reach --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59
```

Available metrics for timeline/aggregation/distribution: `followers`, `impressions`, `engagement`, `reach`, `clicks`, `likes`, `comments`, `shares`.

When presenting analytics, summarize the key takeaways rather than dumping raw JSON. Highlight what's working, what's not, and suggest next steps. When pulling analytics, cast a wide net — check posts AND reels for a fuller picture rather than just one command.

### Managing existing posts

```bash
metricool post list --start 2026-03-01T00:00:00 --end 2026-03-31T23:59:59
metricool post update POST_ID --text "Updated content"
metricool post delete POST_ID
```

### AI-powered content creation

Metricool has built-in AI for generating and refining content:

```bash
# Generate content from a prompt
metricool ai generate --prompt "Write about AI trends in marketing" --language en --tone professional --network linkedin

# Refine existing post
metricool ai regenerate --post-id POST_ID --language en --tone casual

# Quick actions on text (shorten, expand, rephrase, etc.)
metricool ai quick-action --text "Long text here..." --action shorten

# Natural language scheduling
metricool ai schedule --text "tomorrow at 3pm" --timezone "America/New_York"
metricool ai schedule-status --request-id REQUEST_ID
```

### Inbox and conversations

Respond to DMs, comments, and reviews across networks:

```bash
metricool inbox list --network instagram
metricool inbox reply --conversation-id ID --message "Thanks for reaching out!"
metricool inbox comments --network facebook
metricool inbox comment-reply --comment-id ID --message "Appreciate the feedback!"
metricool inbox reviews
metricool inbox review-reply --review-id ID --message "Thank you for the review!"
```

### Competitor tracking

```bash
metricool competitors list instagram
metricool competitors add instagram --username competitor_handle
metricool competitors posts instagram --id COMPETITOR_ID --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59
metricool competitors timelines --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59
```

### Content library and hashtags

Save reusable content and track hashtag groups:

```bash
metricool library list
metricool library create --text "Reusable content block" --media "https://..."
metricool hashtags list
metricool hashtags create --hashtag marketing
metricool hashtags stats --hashtag marketing --start 2026-02-01T00:00:00 --end 2026-03-04T23:59:59
```

### Smart Links (Link in Bio)

```bash
metricool smartlinks list
metricool smartlinks create --title "Latest Blog Post" --url "https://purplehorizons.io/blog"
metricool smartlinks analytics --id LINK_ID --start 2026-03-01 --end 2026-03-04
```

## Additional commands

For a full command reference, see `references/commands.md` in the skill directory. The less common commands include:

- **Brand management**: `metricool brand info`, `brand update`, `brand connections`, `brand images`
- **Reports**: `metricool reports list`, `reports status`, `reports config`
- **Ads**: `metricool ads campaigns`, `ads groups`, `ads list`, `ads keywords`
- **Dashboards**: `metricool dashboard list`, `dashboard create`, `dashboard analytics`
- **Media**: `metricool media images`, `media videos`, `media upload`, `media normalize`
- **Calendar**: `metricool calendar list`, `calendar events`, `calendar create`
- **Agency**: team management, client management, roles, collaborators (see `references/commands.md`)

## Global options

- `--blog-id <id>` — override the default brand
- `--json` or `-j` — JSON output (this is the default)
- Dates for post commands use ISO format (`2026-03-05T14:00:00`) with `--timezone`
- Dates for analytics commands also accept ISO format — the CLI converts internally

## Tips for good results

- When the user asks something vague like "how's our social media doing", pull analytics for the last 30 days across their main networks and give a summary
- For post creation, suggest checking `best-time` first so they schedule at optimal times
- If creating multi-network posts, mention that each network may have different character limits and media requirements
- When reviewing drafts, show the post text and ask if they want to approve, edit, or discard
- Use `metricool ai generate` to help draft content, then let the user refine before scheduling
- Present data in a readable way — tables, bullet points, comparisons — not raw JSON
