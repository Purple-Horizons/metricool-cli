# Instagram Analytics — February 2026

## Discovery Process

Ran `metricool --help` to find available commands, then `metricool analytics --help` to learn the analytics subcommands.

## Commands Run

```bash
metricool analytics posts instagram --start 2026-02-01T00:00:00 --end 2026-02-28T23:59:59
```

## Results

Found 1 Instagram feed post in February:

- **Post**: OpenClaw Miami event promo (Feb 10)
- **Type**: Feed image
- **Likes**: 45, Comments: 6, Shares: 12, Saves: 2
- **Reach**: 509, Impressions: 985
- **Engagement**: 12.77%

Also tried `metricool analytics timeline --metric followers` and `metricool analytics aggregation --metric engagement` but both returned 404 errors.

## Raw Data

```json
{
  "postId": "17848390623649328",
  "type": "FEED_IMAGE",
  "likes": 45,
  "comments": 6,
  "shares": 12,
  "interactions": 65,
  "engagement": 12.770137524557956,
  "reach": 509,
  "impressionsTotal": 985
}
```

The post had good engagement. Would need more data points (follower timeline, reach distribution) to give a fuller picture but those endpoints aren't working.
