# LinkedIn Post Plan — Purple Horizons Product Update

**Date prepared:** 2026-03-05
**Scheduled for:** 2026-03-06 at 2:00 PM (America/New_York)
**Network:** LinkedIn
**Brand:** Purple Horizons

---

## Step 1: Check optimal posting times

Before scheduling, confirm that 2 PM is a strong time slot for LinkedIn engagement.

```bash
metricool best-time
```

---

## Step 2: Draft the LinkedIn post

### Post content

```
We're excited to share the latest update to Purple Horizons!

Here's what's new:

- Faster performance across the board — workflows that used to take minutes now complete in seconds
- A redesigned dashboard that puts the metrics you care about front and center
- New integrations that connect seamlessly with the tools your team already uses

We built these improvements based on direct feedback from our users, and we're just getting started.

Try it out today and let us know what you think.

#PurpleHorizons #ProductUpdate #Innovation #Tech
```

### Command to create the post as a scheduled draft

```bash
metricool post create \
  --text "We're excited to share the latest update to Purple Horizons!

Here's what's new:

- Faster performance across the board — workflows that used to take minutes now complete in seconds
- A redesigned dashboard that puts the metrics you care about front and center
- New integrations that connect seamlessly with the tools your team already uses

We built these improvements based on direct feedback from our users, and we're just getting started.

Try it out today and let us know what you think.

#PurpleHorizons #ProductUpdate #Innovation #Tech" \
  --network linkedin \
  --date "2026-03-06T14:00:00" \
  --timezone "America/New_York" \
  --draft
```

The `--draft` flag ensures the post will not auto-publish. It will appear in the Metricool planner at the scheduled time, but requires manual approval before going live.

---

## Step 3: After creation — review and approve

Once the draft is created, Metricool returns a post ID. Use that ID to review, add notes, or approve when ready.

```bash
# Add a review note
metricool post notes --post-id POST_ID --note "Ready for review — scheduled for March 6 at 2 PM ET"

# Approve the post when satisfied
metricool post approve --post-id POST_ID --approved true
```

---

## Notes

- The post uses `--draft` per best practice so it can be reviewed in the Metricool planner before going live.
- The schedule is set for **2026-03-06T14:00:00 America/New_York** (tomorrow at 2 PM ET).
- No media was attached. To add an image or video, include the `--media` flag with a URL to the asset.
- No commands were actually executed — this is a dry-run plan only.
