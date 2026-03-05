# Metricool CLI — Full Command Reference

## Table of Contents
- [Posts](#posts)
- [Analytics](#analytics)
- [AI Features](#ai-features)
- [Competitors](#competitors)
- [Inbox](#inbox)
- [Smart Links](#smart-links)
- [Library](#library)
- [Hashtags](#hashtags)
- [Brand Management](#brand-management)
- [Reports](#reports)
- [Ads](#ads)
- [Dashboards](#dashboards)
- [Media](#media)
- [Calendar](#calendar)
- [Agency Management](#agency-management)
- [Utilities](#utilities)

---

## Posts

```bash
metricool post list --start <datetime> --end <datetime> [--timezone <tz>] [--blog-id <id>]
metricool post create --text <text> --network <networks> [--date <datetime>] [--timezone <tz>] [--draft] [--media <urls>] [--first-comment <text>] [--linkedin-type <type>] [--instagram-type <type>]
metricool post update <post-id> [--text <text>] [--date <datetime>] [--timezone <tz>] [--network <networks>] [--media <urls>]
metricool post delete <post-id>
metricool post approve --post-id <id> --approved <true|false>
metricool post notes --post-id <id> --note <text>
metricool post tasks --post-id <id> [--task <text>] [--completed <true|false>]
```

## Analytics

```bash
# Post performance by network
metricool analytics posts <network> --start <datetime> --end <datetime> [--sort <field>] [--order <asc|desc>]

# Reels and Stories (Instagram, Facebook, TikTok)
metricool analytics reels <network> --start <datetime> --end <datetime>
metricool analytics stories <network> --start <datetime> --end <datetime>

# Timeline metrics (followers, impressions, engagement, reach, etc.)
metricool analytics timeline --metric <metric> --start <datetime> --end <datetime>

# Aggregated metrics
metricool analytics aggregation --metric <metric> --start <datetime> --end <datetime>

# Distribution (geographic, source, etc.)
metricool analytics distribution --metric <metric> --start <datetime> --end <datetime>

# Hashtag performance
metricool analytics hashtags --start <datetime> --end <datetime>
```

Networks: `instagram`, `linkedin`, `twitter`, `facebook`, `tiktok`, `threads`, `bluesky`, `pinterest`
Metrics: `followers`, `impressions`, `engagement`, `reach`, `clicks`, `likes`, `comments`, `shares`

## AI Features

```bash
metricool ai generate --prompt <text> [--language <code>] [--tone <tone>] [--network <network>]
metricool ai regenerate --post-id <id> [--language <code>] [--tone <tone>]
metricool ai quick-action --text <text> --action <shorten|expand|rephrase|...>
metricool ai schedule --text <natural-language> --timezone <tz>
metricool ai schedule-status --request-id <id>
metricool ai languages
```

## Competitors

```bash
metricool competitors list <network>
metricool competitors add <network> --username <handle>
metricool competitors remove <network> --id <competitor-id>
metricool competitors posts <network> --id <competitor-id> --start <datetime> --end <datetime>
metricool competitors timelines --start <datetime> --end <datetime>
```

## Inbox

```bash
metricool inbox list --network <network>
metricool inbox reply --conversation-id <id> --message <text>
metricool inbox comments --network <network>
metricool inbox comment-reply --comment-id <id> --message <text>
metricool inbox reviews
metricool inbox review-reply --review-id <id> --message <text>
```

## Smart Links

```bash
metricool smartlinks list
metricool smartlinks create --title <text> --url <url>
metricool smartlinks update --id <id> --title <text> [--url <url>]
metricool smartlinks delete --id <id>
metricool smartlinks analytics --id <id> --start <date> --end <date>
```

## Library

```bash
metricool library list
metricool library create --text <text> [--media <urls>]
metricool library update --id <id> [--text <text>] [--media <urls>]
metricool library delete --id <id>
```

## Hashtags

```bash
metricool hashtags list
metricool hashtags create --hashtag <tag>
metricool hashtags stats --hashtag <tag> --start <datetime> --end <datetime>
```

## Brand Management

```bash
metricool brands                    # List all brands
metricool brand info                # Current brand details
metricool brand update [--name <name>] [--url <url>]
metricool brand connections         # Connected social accounts
metricool brand images              # Brand images/logos
```

## Reports

```bash
metricool reports list
metricool reports status --report-id <id>
metricool reports config
```

## Ads

```bash
metricool ads campaigns
metricool ads groups --campaign-id <id>
metricool ads list --ad-group-id <id>
metricool ads keywords --ad-group-id <id>
```

## Dashboards

```bash
metricool dashboard list
metricool dashboard create --name <name>
metricool dashboard analytics --dashboard-id <id> --start <date> --end <date>
metricool dashboard sync --dashboard-id <id>
```

## Media

```bash
metricool media images [--limit <n>]
metricool media videos [--limit <n>]
metricool media upload --url <url> --filename <name>
metricool media normalize <url>
```

## Calendar

```bash
metricool calendar list
metricool calendar events --start <date> --end <date>
metricool calendar create --title <text> [--date <datetime>] [--timezone <tz>]
```

## Agency Management

```bash
# Customization
metricool agency customize details
metricool agency customize get
metricool agency customize update --name <name> [--logo-url <url>]
metricool agency customize test-mail --email <email>

# Clients
metricool agency clients list
metricool agency clients add --name <name> --email <email>
metricool agency clients delete --client-id <id>
metricool agency clients assignments --client-id <id>
metricool agency clients resend-link --client-id <id>

# Team
metricool agency team list
metricool agency team roles
metricool agency team add --email <email> --role-id <id>
metricool agency team update --member-id <id> --role-id <id>
metricool agency team delete --member-id <id>
metricool agency team resend-invite --member-id <id>

# Roles
metricool agency roles list
metricool agency roles create --name <name> --permissions <perms>
metricool agency roles update --role-id <id> --name <name>
metricool agency roles delete --role-id <id>

# Collaborators
metricool agency collaborators list
metricool agency collaborators add --email <email> --role-id <id>
metricool agency collaborators update --collaborator-id <id> --role-id <id>
metricool agency collaborators delete --collaborator-id <id>
metricool agency collaborators resend-link --collaborator-id <id>
metricool agency collaborators delete-assignment --collaborator-id <id> --brand-id <id>
```

## Utilities

```bash
metricool best-time                 # Best time to publish
metricool user                      # User account info
metricool subscription              # Plan/subscription details
metricool suggestions <network>     # Account suggestions
metricool counters                  # Scheduler counters
metricool gif --query <text>        # Search GIFs
metricool ping                      # API health check
metricool stats <network> --start <datetime> --end <datetime>  # Quick network stats
```
