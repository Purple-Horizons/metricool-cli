# LinkedIn Post Plan: Purple Horizons Product Update

## Post Content

```
We're excited to share our latest product update at Purple Horizons!

Here's what's new:
- Faster performance across the board
- Streamlined workflows to help your team move quicker
- New integrations that connect your favorite tools seamlessly

We built these improvements based on your feedback — and we're just getting started.

Check out the full details on our blog and let us know what you think in the comments.

#ProductUpdate #PurpleHorizons #Innovation #TechUpdate
```

## Step 1: Check optimal posting times

Before scheduling, confirm that 2:00 PM is a strong time slot for LinkedIn engagement:

```bash
metricool best-time
```

## Step 2: Create the scheduled LinkedIn post

Schedule the post for tomorrow (2026-03-06) at 2:00 PM Eastern:

```bash
metricool post create \
  --text "We're excited to share our latest product update at Purple Horizons!

Here's what's new:
- Faster performance across the board
- Streamlined workflows to help your team move quicker
- New integrations that connect your favorite tools seamlessly

We built these improvements based on your feedback — and we're just getting started.

Check out the full details on our blog and let us know what you think in the comments.

#ProductUpdate #PurpleHorizons #Innovation #TechUpdate" \
  --network linkedin \
  --date "2026-03-06T14:00:00" \
  --timezone "America/New_York"
```

## Step 3: Verify the post was scheduled

List upcoming scheduled posts to confirm it appears in the planner:

```bash
metricool post list --start 2026-03-06T00:00:00 --end 2026-03-06T23:59:59
```

## Notes

- The `--date` flag is set to `2026-03-06T14:00:00` (tomorrow at 2:00 PM).
- The `--timezone` flag is set to `America/New_York` so the time is interpreted as Eastern.
- No `--draft` flag is used since the user explicitly asked to schedule the post (not just draft it).
- If a media asset (image or video) is available for the update, add `--media "https://..."` to the create command to include it.
- After scheduling, the CLI will return a post ID that can be used to update or delete the post if needed:
  - `metricool post update POST_ID --text "Updated content"`
  - `metricool post delete POST_ID`
