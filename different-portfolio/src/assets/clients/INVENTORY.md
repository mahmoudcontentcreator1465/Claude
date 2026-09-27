# Client logo inventory

**Status: COLLECTING. Do not finalize.** Every client is `pending` in `src/content/clients.ts`:
hidden on the live site, visible with a "Pending" badge in previews. Nothing is published until
Different confirms that all logos have been received and answers the open questions below.

Names are copied exactly from each logo. Where a logo carries no English (or no Arabic) name,
that language is left empty rather than invented.

## Folders

- `batch-1/`: 4 files saved from the first chat upload (renamed `upload-<n>` by the chat; kept as-is).
- `batch-2/`: `Archive.zip` (received 2026-09-27), 26 files, **original filenames preserved**.
  Arabic filenames were stored in the ZIP without the UTF-8 flag and have been decoded back to
  their real names. macOS `__MACOSX/` metadata files were skipped.

## Duplicates

These batch-2 files are byte-identical to batch-1 files; batch-1 copies stay in use as instructed:

| batch-1 (in use) | batch-2 original filename |
|---|---|
| upload-2.jpg (WhiteSky) | 23348187_548069678865739_8144084035686105088_n.jpg |
| upload-3.jpg (Charm Light) | 736371989_17970675153075962_6293164190197210827_n.jpg |
| upload-4.jpg (Bosat) | 445104408_855292479949293_6195387118907394115_n.jpg |
| upload-5.jpg (Sobek) | 671134384_955492216872985_935924990703332078_n.jpg |

## Clients (24 unique)

Card: `artwork` = file has its own background, shown whole; `light` / `dark` = transparent file on a white / black card.

| # | Name on logo (EN · AR) | File(s) | Format | Card | Status / question |
|---|---|---|---|---|---|
| 1 | WhiteSky Travel · وايت سكاي للسياحة | batch-1/upload-2.jpg | JPEG 597² | artwork | pending |
| 2 | Charm Light Tourism · شارم لايت للسياحة | batch-1/upload-3.jpg | JPEG 1080² | artwork | ⚠️ "CHARM" vs "شارم" (Sharm): which spelling? |
| 3 | Bosat · بساط | batch-1/upload-4.jpg | JPEG 800² | artwork | pending |
| 4 | Sobek Travel · (none) | batch-1/upload-5.jpg | JPEG 480² | artwork | pending; low-res, a larger file would help |
| 5 | Mega Star Tours · ميجا ستار تورز | 469187836_…_n.jpg (main) + Layer 1 c.png (alt) | JPEG 320² / PNG | artwork / light | ⚠️ confirm main vs. alternative version; main is low-res (320px) |
| 6 | AbouSamra Travel · (none) | 553573056_…_n.jpg | JPEG 480² | artwork | pending |
| 7 | Tropic Travel · ترويبك للسياحة | 788453780_…_n.jpg | JPEG 1600² | artwork | pending |
| 8 | I Star EG · (none) | 631060198_…_n.jpg | JPEG 1080² | artwork (dark) | pending |
| 9 | Tropitel Valley Tours · تروبيتل فالي للسياحة | 656134369_…_n.avif | AVIF 1024² | artwork | ⚠️ **new in the ZIP** (not among the chat images). Confirm |
| 10 | Sisi Travel · سيسي ترافيل | سيسي ترافيل فرع المهندسين.png + سيسي ترافيل مدينة نصر.png | PNG 1080² | light (zoomed) | ⚠️ one client with two branch logos, or two entries? |
| 11 | Utopia Travel · (none) | شنمىسيرنم.png | PNG 213×107 | light | pending (filename is unrelated text) |
| 12 | New Age Tourism · نيوايدج | WhatsApp Image 2026-02-10 at 10.36.16 AM copy 4.png | PNG 181×135 | light | pending |
| 13 | Nefertary Travel · نفرتارى للسياحة | Group 9.png | PNG 211×127 | dark | pending |
| 14 | Marbya Tours · (none) | Layer 2c.png | PNG 236×108 | light | ⚠️ confirm spelling "Marbya" |
| 15 | Kyrello Tours · (none) | Kyrello-Vector-Smart-Object.png | PNG 255×61 | light | pending |
| 16 | Funny Tours · (none) | Layer 2.png | PNG 138×83 | light | pending |
| 17 | (no English) · باب العمرة | logo1.png | PNG 199×123 | dark | ⚠️ no English name on the logo. Official English name, or show Arabic on /en? (This is the logo that looked blank in chat.) |
| 18 | World Gate · (none) | world gate logo-01.png | PNG 121×133 | light | pending |
| 19 | 1 Touch · (tagline: مركز صيانة متكامل) | Group 1.png | PNG 119×122 | light | ⚠️ car service centre, not travel. Include? (not featured on home meanwhile) |
| 20 | Safe Way Travel · سيف واي | logo (1).png | PNG 957×335 | light | pending |
| 21 | New Jersey Tours · نيو جيرسي للسياحة | Layer 0.png | PNG 906×1136 | light | pending |
| 22 | Lines Travel · (none) | logo.png | PNG 206×79 | light | pending |
| 23 | GtaOtel · (none) | 29abb490-1d57-40ed-a508-e7518726c3b9.png | PNG 141×152 | light | ⚠️ confirm spelling/capitalisation |
| 24 | Exodus Travel · (none) | Exodus Logo 02.png | PNG 491×166 | dark | pending (this is the "X… Travel" logo from chat) |

## Previously seen in chat, now received

All 21 logos that were only seen as chat images have arrived as files in the ZIP. Nothing seen in
chat is still missing. The ZIP also added one logo not seen before: Tropitel Valley Tours.

## Quality notes (optional improvements, not blockers)

Small files that will look soft on large screens: Sobek (480px), AbouSamra (480px), Mega Star (320px),
and the small transparent PNGs (World Gate 121px, 1 Touch 119px, Funny Tours 138px). Vector (SVG/PDF) or
larger PNG versions would sharpen them.
