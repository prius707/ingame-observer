# Mirror event stills locally

Downloads remote `imageUrl` values from `src/events.ts` into `public/event-photos/`
and rewrites those fields to `event-photos/<file>` so visitors never hit Flickr/Smugmug.

```bash
python3 scripts/mirror-event-photos.py
```

Requires network access. Safe to re-run (skips existing files).
