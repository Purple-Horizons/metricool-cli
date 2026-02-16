---
name: metricool-cli
description: Full Metricool API CLI for scheduling posts, analytics, inbox, competitors, agency management, and more.
homepage: https://github.com/Purple-Horizons/metricool-cli
metadata: {"openclaw":{"emoji":"📊","requires":{"bins":["metricool"],"env":["METRICOOL_USER_TOKEN","METRICOOL_USER_ID"]}}}
---

# metricool-cli

Full CLI for the [Metricool](https://metricool.com) API. Schedule posts, pull analytics, manage inbox, track competitors, handle agency teams — all from your terminal.

## Setup

```bash
npm install -g metricool-cli
# or clone and link
git clone https://github.com/Purple-Horizons/metricool-cli.git
cd metricool-cli && npm link
```

Create `.env` in the CLI directory (or export env vars):

```env
METRICOOL_USER_TOKEN=your_token
METRICOOL_USER_ID=your_user_id
METRICOOL_BLOG_ID=your_default_brand_id
```

Get your credentials from the Metricool API settings.

## Commands

### Posts

```bash
metricool post list --start 2026-02-01T00:00:00 --end 2026-02-28T23:59:59
metricool post create --text "Hello world!" --network linkedin --date "2026-02-17T10:00:00" --timezone "America/New_York"
metricool post create --text "Multi-platform" --network linkedin,instagram --media "https://example.com/img.jpg" --draft
metricool post update POST_ID --text "Updated text"
metricool post delete POST_ID
metricool post approve --post-id POST_ID --approved true
metricool post notes --post-id POST_ID --note "Reviewed by team"
```

### Analytics

```bash
metricool analytics posts linkedin --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics reels instagram --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics stories instagram --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics timeline --metric followers --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics aggregation --metric engagement --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics distribution --metric reach --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool analytics hashtags --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

Networks: `instagram`, `linkedin`, `twitter`, `facebook`, `tiktok`, `threads`, `bluesky`, `pinterest`

### AI Features

```bash
metricool ai generate --prompt "Write about AI trends" --language en --tone professional --network linkedin
metricool ai regenerate --post-id POST_ID --language en --tone casual
metricool ai quick-action --text "Long text..." --action shorten
metricool ai schedule --text "tomorrow at 3pm" --timezone "America/New_York"
metricool ai schedule-status --request-id REQUEST_ID
```

### Competitors

```bash
metricool competitors list instagram
metricool competitors add instagram --username competitor_handle
metricool competitors remove instagram --id COMPETITOR_ID
metricool competitors posts instagram --id COMPETITOR_ID --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
metricool competitors timelines --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59
```

### Inbox

```bash
metricool inbox list --network instagram
metricool inbox reply --conversation-id ID --message "Thanks!"
metricool inbox comments --network facebook
metricool inbox comment-reply --comment-id ID --message "Thank you!"
metricool inbox reviews
metricool inbox review-reply --review-id ID --message "Appreciated!"
```

### Smart Links (Link in Bio)

```bash
metricool smartlinks list
metricool smartlinks create --title "My Site" --url "https://example.com"
metricool smartlinks update --id LINK_ID --title "Updated"
metricool smartlinks delete --id LINK_ID
metricool smartlinks analytics --id LINK_ID --start 2026-02-01 --end 2026-02-16
```

### Agency & Team Management

```bash
# Customization
metricool agency customize details
metricool agency customize get
metricool agency customize update --name "My Agency" --logo-url "https://..."
metricool agency customize test-mail --email "test@example.com"

# End-clients
metricool agency clients list
metricool agency clients add --name "Client Corp" --email "client@corp.com"
metricool agency clients delete --client-id ID
metricool agency clients assignments --client-id ID
metricool agency clients resend-link --client-id ID

# Team members
metricool agency team list
metricool agency team roles
metricool agency team add --email "new@agency.com" --role-id ROLE_ID
metricool agency team update --member-id ID --role-id NEW_ROLE
metricool agency team delete --member-id ID
metricool agency team resend-invite --member-id ID

# Brand roles
metricool agency roles list
metricool agency roles create --name "Editor" --permissions "read,write"
metricool agency roles update --role-id ID --name "Senior Editor"
metricool agency roles delete --role-id ID

# Collaborators
metricool agency collaborators list
metricool agency collaborators add --email "collab@example.com" --role-id ROLE_ID
metricool agency collaborators update --collaborator-id ID --role-id NEW_ROLE
metricool agency collaborators delete --collaborator-id ID
metricool agency collaborators resend-link --collaborator-id ID
metricool agency collaborators delete-assignment --collaborator-id ID --brand-id BRAND_ID
```

### Library, Hashtags, Reports

```bash
metricool library list
metricool library create --text "Reusable content" --media "https://..."
metricool hashtags list
metricool hashtags create --hashtag marketing
metricool reports list
metricool reports status --report-id ID
metricool reports config
```

### Media, Calendar, Dashboards

```bash
metricool media images --limit 50
metricool media upload --url "https://..." --filename "image.jpg"
metricool media normalize "https://external.com/image.jpg"
metricool calendar list
metricool calendar events --start 2026-02-01 --end 2026-02-28
metricool dashboard list
metricool dashboard create --name "Q1 2026"
metricool dashboard analytics --dashboard-id ID --start 2026-02-01 --end 2026-02-16
```

### Advertising

```bash
metricool ads campaigns
metricool ads groups --campaign-id ID
metricool ads list --ad-group-id ID
metricool ads keywords --ad-group-id ID
```

### Utilities

```bash
metricool brands                          # List all brands
metricool best-time --network linkedin    # Best time to post
metricool user                            # User info
metricool subscription                    # Plan details
metricool suggestions twitter             # Account suggestions
metricool counters                        # Scheduler counters
metricool gif --query "celebration"       # Search GIFs
metricool ping                            # Health check
```

## Global Options

- `--blog-id <id>` — Override default brand (falls back to `METRICOOL_BLOG_ID`)
- `--json` or `-j` — JSON output (default)

## Date Handling

Dates are passed as-is to the API (no UTC conversion). Always pair with `--timezone`:

```bash
--date "2026-02-17T15:00:00" --timezone "America/New_York"
```

## Scripting

All commands output JSON. Pipe through `jq`:

```bash
# Top 5 LinkedIn posts by engagement
metricool analytics posts linkedin --start 2026-02-01T00:00:00 --end 2026-02-16T23:59:59 \
  | jq '.posts | sort_by(.engagement) | reverse | .[0:5]'

# AI generate + schedule
CONTENT=$(metricool ai generate --prompt "AI trends" --language en --tone professional | jq -r '.text')
metricool post create --text "$CONTENT" --network linkedin --date "2026-02-17T10:00:00"
```

## Tests

```bash
npm test  # 57 unit tests
```

## License

MIT
