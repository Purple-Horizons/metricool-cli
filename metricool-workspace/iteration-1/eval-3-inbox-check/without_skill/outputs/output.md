# Inbox Check

## Discovery Process

Ran `metricool --help` to find inbox commands, then `metricool inbox --help` to learn subcommands.

## Commands Attempted

```bash
metricool inbox list --network instagram
```

Got error: `BAD_REQUEST` — "getConversations.provider must not be null"

The `--network` option doesn't seem to work correctly. Tried several variations but couldn't get past the error.

Also tried:
```bash
metricool inbox comments --network facebook
metricool inbox reviews
```

These also returned errors.

## Result

Unable to retrieve inbox data due to CLI parameter issues. The `--network` flag doesn't appear to be passed correctly to the API. Would need to investigate the CLI code or use the Metricool web interface directly.

## Recommendation

Check the Metricool web dashboard for unanswered messages, or investigate why the inbox CLI commands are failing.
