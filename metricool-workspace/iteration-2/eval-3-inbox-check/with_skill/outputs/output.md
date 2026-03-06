# Purple Horizons Inbox Check -- March 5, 2026

## Summary

Checked inbox across 4 networks: Instagram, Facebook, Twitter/X, and LinkedIn. Found **23 unanswered conversations** total, mostly on Twitter/X. Categorized below by priority.

**Networks checked:**
- **Instagram** -- Empty (no conversations)
- **Facebook** -- 1 conversation (old, low priority)
- **Twitter/X** -- 22 conversations with unanswered messages
- **LinkedIn** -- API returned 500 error (inbox not accessible via Metricool for this account)

**Note:** Comments and reviews endpoints have a CLI bug (sends `network` param instead of `provider`) so those could not be checked. This affects `metricool inbox comments` and `metricool inbox reviews`.

---

## HIGH PRIORITY -- Genuine outreach, collaboration requests, action needed

These are real people asking substantive questions or proposing meaningful collaboration. They deserve a response.

### 1. @6packbrands (Twitter) -- Mar 5
> "hi gianni, your point about Meta annotators reviewing Ray-Ban glasses footage was eye-opening. is that the reason why you are building local-first solutions around this?"

Thoughtful question about your content/philosophy. Fresh (today). Worth a reply.

### 2. @Alexintosh (Twitter) -- Feb 18
> "Would love to learn more about what you are doing and compare notes on all things openclaw."

Italian dev in Lisbon, expressed genuine interest in OpenClaw. Multi-message conversation already started (you shared background). He's waiting for a follow-up. **2+ weeks unanswered.**

### 3. @bradmillscan (Twitter) -- Feb 16
> "my agent submitted some work to your GitHub for the voice project, could you guys validate it with your agents?"

Technical collaboration request -- someone submitted code. Should check the GitHub repo and respond. **2.5 weeks unanswered.**

### 4. @Severin_Spag (Twitter) -- Feb 15
> "The claim protocol is a clever solve. I've been thinking about this a lot, like what happens when you have 5 agents and a human all touching the same service? Curious if your lock is file-level or more granular than that."

Technical question about your claim protocol architecture. Shows deep engagement. **2.5 weeks unanswered.**

### 5. @bc1beat (Twitter) -- Feb 14
> "Hi Gianni, I saw you have openclaw hackerthon 24th Feb. can I come over to present my open source project ClawRouter?"

Wanted to present at your hackathon. The event date has passed (Feb 24), but still worth a follow-up to maintain the relationship. **3 weeks unanswered.**

### 6. @DerekNonGeneric (Twitter) -- Feb 21
> "I saw the Innovation Intern role posted on the Purple Horizons website... I was hoping you could clarify whether the internship is paid."

You already replied (paid, reopening in summer, invited to Tech Tuesday). Status: READ. **This one is handled** -- your last message was the final word.

### 7. @RalphQuintero (Twitter) -- ongoing
Sent a link on Mar 4: "Check out the dummy HDMI thing." Regular link-sharing contact. Has sent several links over weeks. Low-effort reply possible.

### 8. @Alesia_io (Twitter) -- Feb 24
> "I saw that you were organizing an event in Barcelona? And I was wondering if you were looking for photographers or videomaker..."

Event services offer. Sent twice (Miami, then Barcelona). Could be useful if you're planning events. **1.5 weeks unanswered.**

---

## MEDIUM PRIORITY -- Casual/social messages worth acknowledging

### 9. @TheMiamiApe (Twitter) -- Mar 3
> "Hola! Si alguien esta por Buenos Aires :)"

Casual check-in with a link. Quick reply possible.

### 10. @nielsen396 (Twitter) -- Mar 2
> "oh wow wouldnt have guessed that i find you on X Gianni"

Someone recognized you. Brief acknowledgment would be nice.

### 11. @fernytillyy_ (Twitter) -- Mar 3
> "im back Gianni"

Reconnecting. Short reply.

### 12. @MatilRush (Twitter) -- Feb 27
> "how are you doing Gianni"

Simple check-in. Quick response.

### 13. @0xNuren (Twitter) -- Feb 25
> "GM! Can we discuss a possible collab with GPT360?"

Collaboration request. Could be worth exploring or declining. **1+ week unanswered.**

### 14. Niramure Martin (Facebook) -- Jul 2021
> "Oke"

Old Facebook message from 2021. Status: PENDING but very stale. No action needed.

---

## LOW PRIORITY / SPAM -- No response needed

These are spam, scam, or automated outreach messages. Safe to ignore or mark as read.

| From | Date | Type |
|------|------|------|
| @sollypunk | Mar 2 | VC scam (Consensus VC Fund, Telegram redirect) |
| @jay_franksCTO | Feb 24 | Same VC scam (identical Consensus VC Fund template) |
| @saboonagyy | Feb 26 | Cold email tool pitch ("30k emails/month for $97") |
| @drivemetamax | Feb 25-26 | "Creator campaigns" / dealflow pitch |
| @EdoAToptareach | Feb 13 | Growth tool pitch (Reddit/Twitter engagement app) |
| @_WEB3M_ | Mar 4 | Automated outreach ("intent-based outreach system") |
| @yekculture | Mar 2 | Crypto wallet address / unclear purpose |
| @GorgTillie | Feb 23 | "remember me Gianni?" -- likely bot |
| @tyesoi_yka | Feb 23 | "im back Gianni" -- likely bot (same template as others) |
| @arshktillie | Feb 15 | "im back Gianni" -- likely bot (same template as others) |
| @momizi1208aya1 | Feb 17 | "omg the internet is soo crazy" -- likely bot |

**Pattern detected:** Multiple accounts using identical "im back Gianni" phrasing -- these are bot/spam accounts.

---

## Recommended Actions

1. **Reply today** to @6packbrands (fresh, substantive question about your work)
2. **Reply this week** to @Alexintosh, @bradmillscan, and @Severin_Spag (genuine tech/OpenClaw interest, overdue)
3. **Quick acknowledgment** to @bc1beat about the hackathon (even though the date passed)
4. **Batch-reply** to casual messages (@TheMiamiApe, @nielsen396, @MatilRush)
5. **Ignore** the 11 spam/bot messages
6. **Fix CLI bug:** `metricool inbox comments` and `metricool inbox reviews` send `network` instead of `provider` as the API query parameter, so comments/reviews could not be checked

---

## Data Sources

- `metricool inbox list --network instagram` -- 0 conversations
- `metricool inbox list --network facebook` -- 1 conversation
- `metricool inbox list --network twitter` -- 22 conversations
- `metricool inbox list --network linkedin` -- API 500 error (not available)
- `metricool inbox comments` -- CLI bug (param mismatch), not available
- `metricool inbox reviews` -- CLI bug (param mismatch), not available
