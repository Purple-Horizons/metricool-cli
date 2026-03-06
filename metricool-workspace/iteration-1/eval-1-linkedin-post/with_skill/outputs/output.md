# LinkedIn Post Plan: Purple Horizons Product Update

## Task

Draft a LinkedIn post about our latest product update and schedule it for tomorrow (2026-03-05) at 2:00 PM Eastern.

## Reasoning

1. **Network**: LinkedIn only, as specified in the task.
2. **Scheduling**: Tomorrow is 2026-03-05. The target time is 14:00 in America/New_York timezone. The `metricool post create` command accepts ISO 8601 datetime with a `--timezone` flag.
3. **Pre-check**: Before scheduling, it would be wise to run `metricool best-time` to confirm that 2:00 PM is a strong posting window for LinkedIn. If a better time were suggested, we could adjust.
4. **Content**: The post should be professional in tone, appropriate for LinkedIn, and highlight a product update from Purple Horizons. Since no specific product details were provided, the draft below uses a general product-update framing that can be customized.

## Step 1: Check optimal posting times (optional but recommended)

```bash
metricool best-time
```

This returns the best posting windows per network. If 2:00 PM ET on a Wednesday ranks well for LinkedIn, we proceed as planned.

## Step 2: Draft post content

Below is the proposed LinkedIn post:

---

**Post text:**

```
We're excited to share the latest update from Purple Horizons.

Our team has been hard at work building features that make your workflow faster, smarter, and more intuitive. Here's what's new:

- Streamlined dashboard with real-time insights
- Enhanced integrations to connect the tools you already use
- Performance improvements across the board

This release reflects the feedback we've heard directly from our users -- and we're just getting started.

Try it out today and let us know what you think. We'd love to hear your feedback in the comments.

#PurpleHorizons #ProductUpdate #Innovation #Tech
```

---

## Step 3: Schedule the post

```bash
metricool post create \
  --text "We're excited to share the latest update from Purple Horizons.

Our team has been hard at work building features that make your workflow faster, smarter, and more intuitive. Here's what's new:

- Streamlined dashboard with real-time insights
- Enhanced integrations to connect the tools you already use
- Performance improvements across the board

This release reflects the feedback we've heard directly from our users -- and we're just getting started.

Try it out today and let us know what you think. We'd love to hear your feedback in the comments.

#PurpleHorizons #ProductUpdate #Innovation #Tech" \
  --network linkedin \
  --date "2026-03-05T14:00:00" \
  --timezone "America/New_York"
```

## Step 4: Verify the post was scheduled

After creation, the command returns JSON with a post ID. To confirm it appears in the calendar:

```bash
metricool post list --start 2026-03-05T00:00:00 --end 2026-03-05T23:59:59
```

This should show the scheduled LinkedIn post for 2:00 PM ET on March 5, 2026.

## Notes

- No `--draft` flag is used here because the task asks to schedule, not just draft. If you wanted to create it as a draft first for review, add `--draft` to the create command, then approve it later with `metricool post approve --post-id POST_ID --approved true`.
- No media was attached. To add an image or video, include `--media "https://url-to-image.jpg"` in the create command.
- The post content is a general product update template. Replace the bullet points with actual feature details before publishing.
