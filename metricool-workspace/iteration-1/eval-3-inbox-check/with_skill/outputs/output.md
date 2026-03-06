# Inbox Check — All Networks

## Commands Run

```bash
metricool inbox list --network instagram   # Note: CLI has a bug — uses "network" param but API expects "provider"
metricool inbox list --network facebook
metricool inbox list --network twitter
metricool inbox list --network linkedin    # Returns 500 error
metricool inbox comments --network instagram
metricool inbox comments --network facebook
metricool inbox reviews
```

(Had to work around a CLI bug where the inbox command passes `network` instead of `provider` to the API. Used direct API calls as fallback.)

## Results by Network

### Instagram — No messages
No conversations found in the inbox.

### Facebook — No messages
No conversations found in the inbox.

### LinkedIn — Error
The LinkedIn inbox endpoint returned a 500 server error. This may be a Metricool API issue or a permissions problem with the LinkedIn connection.

### Twitter/X — 25 conversations, most need attention

**Priority: Should Reply**

| From | Message Preview | Date |
|------|----------------|------|
| @6packbrands | "your point about Meta annotators reviewing Ray-Ban glasses footage was eye-opening. is that the reason why you are building local-first solutions?" | Mar 5 |
| @RalphQuintero | "Check out the dummy HDMI thing" (+ 4 more msgs) | Mar 4 |
| @Alexintosh | "Would love to learn more about what you are doing and compare notes on all things openclaw." (+ 4 more msgs) | Recent |
| @bradmillscan | "my agent submitted some work to your GitHub for the voice project, could you guys validate it?" | Recent |
| @xAleAguilar | Active conversation (5 new messages) | Recent |
| @DerekNonGeneric | "I saw the Innovation Intern role posted on the Purple Horizons website" — job inquiry | Recent |
| @bc1beat | "I saw you have openclaw hackathon 24th Feb. can I come over to present my open source project?" | Recent |
| @Alesia_io | "I saw that you were organizing an event in Barcelona? And I was wondering if..." | Recent |
| @Severin_Spag | "The claim protocol is a clever solve. I've been thinking about this a lot..." | Recent |

**Likely Spam/Low Priority**

| From | Message Preview |
|------|----------------|
| @_WEB3M_ | Automated outreach about intent-based outbound |
| @sollypunk / @jay_franksCTO | VC fund cold outreach (Consensus VC) |
| @saboonagyy | Email marketing pitch |
| @0xNuren | GPT360 collab request |
| @drivemetamax | Creator campaigns pitch |
| @EdoAToptareach | Audience growth pitch |
| @fernytillyy_ / @tyesoi_yka / @arshktillie / @momizi1208aya1 / @GorgTillie | Likely bots — identical "im back Gianni" messages from multiple accounts |

## Recommended Actions

1. **Reply to @6packbrands** — genuine question about your Meta/local-first thesis, good engagement opportunity
2. **Reply to @Alexintosh** — they want to compare OpenClaw notes, could be a valuable connection
3. **Reply to @bradmillscan** — they submitted work to your GitHub, needs validation
4. **Reply to @DerekNonGeneric** — job inquiry about Innovation Intern role
5. **Reply to @bc1beat** — interested in presenting at your hackathon
6. **Catch up with @RalphQuintero and @xAleAguilar** — active conversations with multiple messages
7. **Ignore the bot cluster** (fernytillyy_, tyesoi_yka, arshktillie, momizi1208aya1, GorgTillie) — same message pattern
8. **Ignore cold outreach** from _WEB3M_, sollypunk, jay_franksCTO, saboonagyy, drivemetamax, EdoAToptareach

## Bug Notes

The `metricool inbox list --network <name>` command doesn't work — it passes `network` as a query param but the API expects `provider`. This should be fixed in the CLI.
