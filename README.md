<p align="center">
  <img src="assets/header.png" alt="Metricool CLI" width="100%" />
</p>

<h1 align="center">Metricool CLI</h1>

<p align="center">
  <strong>The missing command-line interface for Metricool.</strong><br>
  Schedule posts, pull analytics, track competitors, manage inbox — all from your terminal.
</p>

<p align="center">
  <a href="#install">Install</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#commands">Commands</a> •
  <a href="#why">Why?</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Why?

Metricool's MCP server can **read** your data but **can't schedule posts** — the `providers` field gets sent as strings (`["linkedin"]`) instead of objects (`[{"network":"linkedin"}]`). We hit this wall, so we built the full thing.

100+ commands. Every Metricool API endpoint. Works with AI agents, cron jobs, or just your terminal.

**Built by [Purple Horizons](https://purplehorizons.io)** — an AI consultancy in Miami that builds tools like this for breakfast.

## Install

```bash
# From GitHub
git clone https://github.com/Purple-Horizons/metricool-cli.git
cd metricool-cli
npm install
npm link
```

## Quick Start

**1. Get your credentials** from [Metricool account settings](https://app.metricool.com/settings).

**2. Create `.env`** in the CLI directory:

```env
METRICOOL_USER_TOKEN=your_token
METRICOOL_USER_ID=your_user_id
METRICOOL_BLOG_ID=your_default_blog_id
```

**3. Verify it works:**

```bash
metricool brands
metricool ping
```

## Commands

Every command supports `--blog-id <id>` to override the default brand.

### 📝 Posts

The command you came here for. Create, schedule, update, and delete posts across all networks.

```bash
# Schedule a LinkedIn post for 3pm today
metricool post create \
  --text "Just shipped a new feature!" \
  --network linkedin \
  --date "2026-02-16T15:00:00" \
  --timezone "America/New_York"

# Multi-network with image
metricool post create \
  --text "Check this out 🚀" \
  --network linkedin,instagram,twitter \
  --media "https://example.com/image.png" \
  --date "2026-02-17T10:00:00" \
  --timezone "America/New_York"

# Create as draft (won't auto-publish)
metricool post create \
  --text "Draft for review" \
  --network linkedin \
  --draft

# With first comment
metricool post create \
  --text "Big announcement!" \
  --network linkedin \
  --first-comment "Link to full article: https://example.com"

# List scheduled posts
metricool post list \
  --start "2026-02-01T00:00:00" \
  --end "2026-02-28T23:59:59"

# Update existing post
metricool post update 12345 --text "Updated copy"

# Delete
metricool post delete 12345

# Notes & approvals
metricool post notes --post-id 12345
metricool post notes --post-id 12345 --note "Ready for review"
metricool post approve --post-id 12345 --status approved
metricool post tasks --status pending
```

**Supported networks:** `linkedin`, `instagram`, `twitter`, `facebook`, `threads`, `tiktok`, `bluesky`, `pinterest`, `youtube`

**Network-specific options:**
- `--linkedin-type POST` (or `poll`)
- `--instagram-type POST` (or `REEL`, `STORY`)

### 📊 Analytics

Pull performance data for any network and time period.

```bash
# Posts by network
metricool analytics posts linkedin --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics posts instagram --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59

# Reels & Stories
metricool analytics reels instagram --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics stories instagram --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59

# Time series, distribution, aggregation
metricool analytics timeline --metric followers --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics distribution --metric engagement --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics aggregation --metric reach --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59

# Hashtag performance
metricool analytics hashtags --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

### 🕵️ Competitors

Track and analyze competitor accounts.

```bash
metricool competitors list instagram
metricool competitors add instagram --username competitor_handle
metricool competitors remove instagram --id COMPETITOR_ID
metricool competitors posts instagram --id COMPETITOR_ID --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool competitors timelines --metric followers --competitor-id COMPETITOR_ID --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

### 📬 Inbox

Manage conversations, comments, and reviews.

```bash
metricool inbox list --network instagram --status unread
metricool inbox reply --conversation-id CONV_ID --message "Thanks!"
metricool inbox comments --network facebook --post-id POST_ID
metricool inbox comment-reply --comment-id COMMENT_ID --message "Appreciate it!"
metricool inbox reviews --network google
metricool inbox review-reply --review-id REVIEW_ID --message "Thank you for the feedback!"
```

### 🤖 AI Features

Generate content and schedule with natural language.

```bash
# Generate post copy
metricool ai generate --prompt "Write about AI in marketing" --language en --tone professional --network linkedin

# Quick actions
metricool ai quick-action --text "Long text that needs shortening" --action shorten

# Natural language scheduling
metricool ai schedule --text "next Monday at 9am" --timezone "America/New_York"
metricool ai schedule-status --job-id JOB_ID

# Regenerate post copy
metricool ai regenerate --post-id 12345 --language en --tone casual

# Available languages
metricool ai languages
```

### 🔗 Smart Links

Manage link-in-bio pages.

```bash
metricool smartlinks list
metricool smartlinks create --title "My Site" --url "https://example.com"
metricool smartlinks update --id LINK_ID --title "Updated"
metricool smartlinks delete --id LINK_ID
metricool smartlinks analytics --id LINK_ID --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

### 📚 Post Library

Save reusable content templates.

```bash
metricool library list
metricool library create --text "Reusable post content" --media "https://example.com/img.jpg"
metricool library update --id POST_ID --text "Updated"
metricool library delete --id POST_ID
```

### #️⃣ Hashtag Tracker

```bash
metricool hashtags list
metricool hashtags create --hashtag marketing
metricool hashtags stats --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

### 📈 Reports & Dashboards

```bash
# Reports
metricool reports list
metricool reports status --report-id REPORT_ID

# Get or set report configuration
metricool reports config
metricool reports config --set '{"key":"value"}'

# Performance dashboards
metricool dashboard list
metricool dashboard create --name "Q1 2026"
metricool dashboard analytics --dashboard-id DASH_ID --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool dashboard sync --dashboard-id DASH_ID
```

### 🏢 Brand & Account

```bash
metricool brand info
metricool brand update --name "New Name"
metricool brand connections
metricool brand images
metricool user
metricool subscription
```

### 📢 Advertising

```bash
metricool ads campaigns
metricool ads groups --campaign-id CAMPAIGN_ID
metricool ads list --ad-group-id AD_GROUP_ID
metricool ads keywords --ad-group-id AD_GROUP_ID
```

### 🖼️ Media

```bash
metricool media images --limit 50
metricool media videos --limit 50
metricool media upload --url "https://example.com/image.jpg" --filename "image.jpg" --content-type "image/jpeg"
metricool media normalize "https://external-cdn.com/image.png"
```

### 🗓️ Calendars

```bash
metricool calendar list
metricool calendar events --start 2026-02-01T00:00:00 --end 2026-02-28T23:59:59
metricool calendar create --name "Content Calendar"
```

### 🏢 Agency & Team Management

Manage your agency's customization, end-clients, team members, roles, and collaborators. All agency commands live under `metricool agency`.

#### Customization Kit

```bash
# Get agency details for current user
metricool agency customize details

# Get customization by agency ID
metricool agency customize get --agency-id 123

# Update branding (logos, mail settings, feature toggles)
metricool agency customize update --agency-id 123 \
  --agency-logo "https://example.com/logo.png" \
  --mail-reply-to "support@agency.com" \
  --support-chat true

# Send a test email
metricool agency customize test-mail --agency-id 123 --to "test@agency.com"
```

#### End-Clients

```bash
# List all end-clients
metricool agency clients list --agency-id 123

# Add a new end-client
metricool agency clients add --agency-id 123 \
  --username "clientuser" \
  --name "Jane" --lastname "Doe" \
  --email "jane@client.com" \
  --timezone "America/New_York"

# Delete an end-client
metricool agency clients delete --agency-id 123 --client-id 456

# Update brand assignments
metricool agency clients assignments --agency-id 123 --client-id 456 \
  --assignments '[{"brandId":789,"roleId":1}]'

# Resend activation link
metricool agency clients resend-link --agency-id 123 --client-id 456
```

#### Team Members

```bash
# List team members
metricool agency team list --agency-id 123

# List available team roles
metricool agency team roles --agency-id 123

# Add team members by email
metricool agency team add --agency-id 123 \
  --emails "alice@agency.com,bob@agency.com" \
  --role-id 1

# Update a member's role
metricool agency team update --agency-id 123 --user-id 789 --role-id 2

# Remove a team member
metricool agency team delete --agency-id 123 --user-id 789

# Resend invitation
metricool agency team resend-invite --agency-id 123 --user-id 789
```

#### Brand Roles

```bash
# List brand roles
metricool agency roles list

# Create a role with permissions
metricool agency roles create --name "Content Creator" \
  --description "Can create and schedule posts" \
  --color "#FF5733" \
  --actions '{"viewAnalytics":true,"fullAccessPlanner":true}'

# Update a role
metricool agency roles update --role-id 1 --name "Senior Creator" --color "#00FF00"

# Delete a role
metricool agency roles delete --role-id 1
```

#### Collaborators

```bash
# List collaborators
metricool agency collaborators list

# Add a collaborator with brand role assignments
metricool agency collaborators add --email "freelancer@example.com" \
  --assignments '[{"brandId":123,"roleId":1}]' \
  --invitation-message "Welcome to the team!"

# Update collaborator assignments
metricool agency collaborators update --collaborator-id 456 \
  --assignments '[{"brandId":123,"roleId":2}]'

# Delete a collaborator
metricool agency collaborators delete --collaborator-id 456

# Resend activation link
metricool agency collaborators resend-link --collaborator-id 456

# Delete a specific brand role assignment
metricool agency collaborators delete-assignment --brand-id 123
```

### 🛠️ Utilities

```bash
metricool best-time --blog-id 4846146
metricool gif --query "celebration" --limit 5
metricool suggestions twitter --query "marketing"
metricool counters
metricool ping
```

## Date Handling

Dates are passed **as-is** to the Metricool API. No UTC conversion.

```bash
--date "2026-02-16T15:00:00" --timezone "America/New_York"
# Sends exactly: dateTime: "2026-02-16T15:00:00", timezone: "America/New_York"
```

All dates use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`

## Agent Integration

This CLI was designed for AI agent workflows. Combine with:

- **[fal.ai](https://fal.ai)** for image generation → pipe URLs to `--media`
- **[OpenClaw](https://github.com/openclaw/openclaw)** for cron-based scheduling
- **jq** for data processing:

```bash
# Top 5 LinkedIn posts by engagement
metricool analytics posts linkedin \
  --start 2026-02-01T00:00:00 \
  --end 2026-02-16T23:59:59 \
  | jq '[.[] | {text: .text[:50], engagement: .engagement}] | sort_by(-.engagement) | .[0:5]'
```

## Contributing

Issues and PRs welcome. This tool covers the full Metricool API — if something's missing or broken, open an issue.

## License

MIT

---

<p align="center">
  Built with ☕ by <a href="https://purplehorizons.io">Purple Horizons</a> — Miami, FL
</p>
