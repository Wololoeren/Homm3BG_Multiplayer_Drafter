# HoMM3 BG — Multiplayer Drafter

Infrastructure analysis and implementation plan.

Sibling apps this one joins, and whose look, stack and conventions it copies:

- [Random Scenario Generator](https://github.com/Wololoeren/Homm3BG-Random-Scenario-Generator)
- [Scenario Editor](https://github.com/Wololoeren/homm3BG_scenario_editor)
- [Hero Randomizer](https://github.com/Imrauviel/Homm3_BG_Hero_Randomizer)

---

## 1. What it has to do

X players, each sitting at their own computer, end up with **one faction and one
hero**, drafted under uniqueness rules, from **randomly dealt pools**, with an
optional **ban phase**, all configured before the draft starts.

Restated as requirements:

| # | Requirement | Notes |
|---|---|---|
| R1 | 2–8 players (config), each gets exactly one faction + one hero | Board game itself is 1–4, but the drafter should not hard-code that |
| R2 | No two players share a faction | Hard invariant, never violated |
| R3 | Hero rules configurable (see §4.3) | The "no hero from the same faction" line is ambiguous — handled by making it a setting rather than a guess |
| R4 | Pools are **random**, size configurable (1 = forced, N = choose one of N) | "Their selection will be random, but ensure the unique faction criteria" |
| R5 | Optional ban phase, 0–2 bans per player | Configured before the draft |
| R6 | Players on different machines, joined by a shared code or URL | The whole infrastructure problem — §3 |
| R7 | Hosted from `github.io` | Static files only. No server, no database, no secrets |
| R8 | Same style as the Scenario Editor | Next.js static export, dark chrome + parchment sheet, Liberation Serif, 14 locales |

---

## 2. The one hard constraint

GitHub Pages serves **static files over HTTPS and nothing else**. No server
process, no WebSocket endpoint, no database, no way to keep a secret. Every
byte of logic runs in the players' browsers.

So "multiplayer" has to be solved without owning a server. There are only four
shapes that can work, and the design below is built so that **all four are the
same app** — the draft rules never know which one is in use.

---

## 3. Infrastructure analysis

### 3.1 The insight that makes this easy

A draft is a **deterministic function of three small things**:

```
state = reduce(config, seed, orderedEventLog)
```

- `config` — player count, pool sizes, ban count, which factions are in play (~30 bytes)
- `seed` — one 64-bit number that drives every random deal
- `eventLog` — the ordered list of "seat 3 banned Inferno", "seat 1 picked Rampart" (~2 bytes each)

The dealt pools are **never stored or transmitted**. Every client re-derives
them from `(seed, config, log)` and gets byte-identical results. A complete
6-player draft with bans is roughly **24 events ≈ 50 bytes ≈ 80 base32
characters** — small enough to live in a URL.

Two consequences:

1. **Synchronisation is a solved problem reduced to its minimum**: broadcast a
   handful of 2-byte events. Any transport can carry that, including a human
   copy-pasting a link.
2. **Nobody can cheat the deal.** The pools are a pure function of a seed fixed
   before the draft starts, so no client can reroll for a better hand, and every
   client can verify every other client's pool.

### 3.2 The second insight: some formats need no sync at all

If the random pools dealt to the players are **disjoint** — player 1 is offered
Castle/Tower, player 2 is offered Rampart/Inferno, and so on, with no overlap —
then **R2 is satisfied by construction**. No two players can collide however
they pick, so everyone can pick *simultaneously* with zero communication.

That collapses the whole networking problem for the default format into:
share one code at the start, share one code at the end. See §4.1.

Sync is only genuinely needed when pools **overlap** (sequential/snake draft) or
when bans are revealed one at a time.

### 3.3 Transport options compared

| Option | Server? | Account? | Cost | Latency | Failure modes | Verdict |
|---|---|---|---|---|---|---|
| **A. Hotseat (one screen)** | no | no | free | n/a | none | **Ship.** Baseline, also the dev/test harness |
| **B. Link / code passing** | no | no | free | human | tedious if many rounds | **Ship.** Perfect for the dealt format; universal fallback |
| **C. WebRTC P2P via [Trystero](https://github.com/dmotz/trystero)** | no (public Nostr/MQTT relays) | no | free | ~50–150 ms | symmetric NAT / corporate firewalls need a TURN server; public relay churn; known trouble with many simultaneous peers | **Ship as default live mode.** 2–8 peers is well inside its comfort zone |
| **D. Cloudflare Worker + Durable Object** | yes (you deploy one) | Cloudflare acct | free tier: 100k req/day, SQLite-backed DOs on the free plan, WebSocket hibernation | ~30–80 ms | you own an ops surface | **Design for it, build later.** The reliable escape hatch when C fails |
| E. Firebase Realtime Database | no code, but a Google project | Google acct | free: 1 GB stored, 10 GB/mo, 100 concurrent connections | ~50 ms | open rules invite abuse; ~100 KB of SDK | Viable, not recommended — heaviest bundle, most config |
| F. Supabase Realtime | no code, a project | acct | free | ~50 ms | **free projects pause after ~1 week idle** — fatal for a tool used once a month | Rejected |
| G. Ably / Pusher | no | acct | free tier | low | publishable key in a static bundle is abusable | Rejected |
| H. Yjs / CRDT | depends | — | — | — | massive overkill: the log is append-only and totally ordered already | Rejected |

Sources: [Cloudflare DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing),
[Firebase RTDB limits](https://firebase.google.com/docs/database/usage/limits),
[Trystero](https://github.com/dmotz/trystero).

### 3.4 Recommendation

Build the draft engine transport-agnostic, and ship **A + B + C**. Keep D as a
one-file addition if P2P proves flaky with the actual group.

```
                +-------------------------------------+
                |        Draft engine (pure TS)       |
                |  reduce(config, seed, log) -> state |
                |  deterministic, no I/O, unit-tested |
                +------------------+------------------+
                                   |
                        +----------v-----------+
                        |  Transport interface |
                        +----------+-----------+
                                   |
        +--------------+-----------+-----------+--------------+
        |              |                       |              |
   local (hotseat)  manual (link/QR)     p2p (Trystero)   relay (CF DO)
     ship M3           ship M4              ship M5        optional
```

### 3.5 Authority model — no host needed

Rather than electing a host that orders events, use a **rule-derived total
order**, which is deterministic and needs no trusted party:

- In a sequential phase, **only the seat whose turn it is** may emit an event.
  Anything else is rejected by every client independently.
- In a simultaneous phase, each seat emits exactly one event; clients buffer
  until all are in, then **sort by seat number** and append. Same order
  everywhere.
- Every client keeps a rolling `stateHash`. Peers exchange it with each event;
  a mismatch shows a visible **"draft desynced"** banner with a "reload from
  code" button rather than silently diverging.

Optional hardening for blind bans (~20 lines): each seat first broadcasts
`sha256(ban || nonce)`, then reveals `(ban, nonce)` once all commitments are in.
Stops a peer from reading someone else's ban off the wire and reacting. Off by
default — friendly game, but cheap to have.

---

## 4. Draft formats and rules

### 4.1 Format A — **Dealt** (simultaneous, disjoint pools) — the default

1. *(optional)* Ban phase.
2. Shuffle the remaining factions once with the seed; hand seat *s* the slice
   `[s*K, s*K+K)`. Pools are disjoint by construction.
3. Everyone picks their faction at the same time. **R2 cannot be violated.**
4. Hero step, same shape (§4.3).

Zero sync required. One code in, one code out. This is the format the "selection
will be random" clarification points at, and it is the fastest to play.

**Feasibility.** Needs `enabledFactions - players*bans >= players*poolSize`:

| Players | Bans each | Factions left (of 10) | Max pool size |
|---|---|---|---|
| 2 | 0 | 10 | 5 |
| 3 | 1 | 7 | 2 |
| 4 | 0 | 10 | 2 |
| 4 | 1 | 6 | 1 (forced) |
| 6 | 0 | 10 | 1 (forced) |

The config screen must compute this live and say **why** a combination is
impossible, and offer the fix ("6 players × pool of 2 needs 12 factions; you
have 10 — switch to Snake, or reduce the pool"). This is a real limit of the
format, not a bug, and hiding it would make the app feel broken.

### 4.2 Format B — **Snake** (sequential, shared pool) — for the tight cases

Turn order 1→N, N→1, …. On each turn the app deals that seat `K` options
sampled from everything still legal, seeded by `hash(seed, "turn", turnIndex)`.
Pools may overlap between turns, so uniqueness is enforced by the engine at pick
time instead of by the deal.

Needs live turn-by-turn sync (C or D), or a code pass per turn (B) if the group
is patient. Handles any player count, any pool size, any ban count.

### 4.3 Hero rules — the ambiguity, resolved as configuration

"…a Hero from that faction, no player can have the same faction, no player can
have a hero from the same faction" reads two ways. Rather than guess, ship a
setting; it is strictly more flexible and it is what "flexible drafter" asks for:

```ts
heroFactionPolicy:
  | "own"            // hero must belong to the player's own drafted faction  (default)
  | "unique-faction" // hero may come from any faction, but no two players'
                     // heroes may share a faction
  | "any"            // free pick from the whole roster
```

Plus two independent switches:

- `uniqueHeroIdentity` (default **on**) — no two players take the same *named*
  hero. This matters: **Tarnum appears in six factions and Lord Haart in two**,
  so under `"own"` two players can otherwise both end up as Tarnum.
- `heroMayComeFromAnotherPlayersTown` (only meaningful under
  `"unique-faction"`) — whether your hero's faction is allowed to be a faction
  someone else drafted as their town.

Under `"own"`, hero pools are per-faction and never collide, so the hero step
inherits the same simultaneous/zero-sync property as §4.1.

### 4.4 Ban phase

- `bansPerPlayer`: 0–2.
- `banVisibility`: `"open"` (sequential, everyone watches) or `"blind"`
  (simultaneous, revealed together — with optional commit-reveal, §3.5).
- Bans come off the **global** faction pool before the deal, so they are
  meaningful under Format A too.
- `banTarget`: `"faction"` or `"faction+hero"`.

### 4.5 Fairness details worth getting right

- One shuffle per deal, not `K` independent samples — guarantees disjointness
  and a uniform distribution in one step.
- Seat order itself is seeded and shown, so nobody argues about who picks first.
- Optional `mirrorPools`: everyone is offered the *same* pool size, always.
- Optional `guaranteeClassMix` for `"own"` hero pools: make sure a dealt hero
  pool is not all-might or all-magic when the faction has both.

---

## 5. Data model

```ts
// ---------- catalogue (src/data, static) ----------
interface Faction {
  id: string;              // "castle"
  name: string;            // display name; localisable
  set: "core" | "tower" | "rampart" | "inferno" | "fortress"
     | "stronghold" | "conflux" | "cove" | "factory" | "bulwark" | "forge";
  color: string;           // banner tint for the seat strip
  crest: string;           // /factions/castle.webp
}

interface Hero {
  id: string;              // "castle-valeska"
  name: string;            // "Valeska"
  factionId: string;
  klass: "might" | "magic";
  /** Heroes that are the same person in more than one faction share this.
   *  Tarnum, Lord Haart. Used by uniqueHeroIdentity. */
  identity?: string;
  set: Faction["set"];
}

// ---------- draft ----------
type Phase = "lobby" | "ban" | "faction" | "hero" | "done";

interface DraftConfig {
  version: number;
  players: number;                 // 2..8
  format: "dealt" | "snake";
  factionPoolSize: number;         // 1..5
  heroPoolSize: number;            // 1..5
  bansPerPlayer: number;           // 0..2
  banVisibility: "open" | "blind";
  banTarget: "faction" | "faction+hero";
  heroFactionPolicy: "own" | "unique-faction" | "any";
  uniqueHeroIdentity: boolean;
  heroMayComeFromAnotherPlayersTown: boolean;
  enabledSets: Faction["set"][];   // which boxes the table owns
  excludedFactions: string[];      // hand-removed
  excludedHeroes: string[];
}

type DraftEvent =
  | { t: "join";   seat: number; name: string }
  | { t: "start";  }
  | { t: "ban";    seat: number; factionId: string }
  | { t: "commit"; seat: number; hash: string }        // blind ban, optional
  | { t: "pickF";  seat: number; factionId: string }
  | { t: "pickH";  seat: number; heroId: string }
  | { t: "undo";   seat: number };                     // rewinds one event

interface DraftState {
  config: DraftConfig;
  seed: string;
  phase: Phase;
  seats: Seat[];                   // name, factionId?, heroId?
  turn: number | null;             // null in simultaneous phases
  bannedFactions: string[];
  pools: Record<number, string[]>; // DERIVED, never persisted
  legal: (seat: number, id: string) => boolean;
  hash: string;                    // for desync detection
}
```

`pools` being derived rather than stored is the load-bearing decision: it is
what keeps the shareable code short and what makes cheating impossible.

---

## 6. Sharing: codes and URLs

```
https://wololoeren.github.io/Homm3BG_Multiplayer_Drafter/#/d/<code>
https://wololoeren.github.io/Homm3BG_Multiplayer_Drafter/#/d/<code>/s/3   <- claim seat 3
```

- **Hash fragment**, not a query string: it is never sent to GitHub's servers,
  and it needs no routing config in a static export.
- `<code>` = base32(Crockford) of a compact binary blob: `version | config
  bitfields | seed | varint event log`. Crockford base32 because it survives
  being read aloud over voice chat (no `I`/`L`/`O`/`U` confusion) — which is
  exactly how a board-game group will use it.
- A **QR code** next to it for phones (`qrcode-generator`, ~4 KB).
- Human-friendly short form for the lobby: `HOMM3-4P2K1B-7QX3M` — enough to
  reconstruct config + seed, with the log passed separately.
- Every code round-trips through the same sanitiser as localStorage, so a
  mangled or hostile code fails closed to the lobby rather than half-loading.

---

## 7. Screens

1. **Lobby / setup** (host) — player count, format, pool sizes, bans, hero
   policy, owned expansions. A live feasibility line under the controls. Big
   **Create draft** → code + URL + QR + "Copy invite".
2. **Waiting room** — seat strip showing who has joined (live in P2P; in code
   mode, seats are claimed by opening `/s/<n>`). Host presses **Start**, which
   freezes the config into the seed.
3. **Ban phase** — the faction grid, dimmed as bans land; your own ban budget in
   the corner. Blind mode hides others until reveal.
4. **Faction pick** — your dealt pool as large faction cards (crest, name,
   colour). A dimmed sidebar shows the other seats and what they have locked in.
   Pool of 1 shows a "your faction was dealt" card with a confirm.
5. **Hero pick** — same shape, hero cards showing name, faction crest and the
   might/magic icon (reusing the Hero Randomizer's `hero_stats-<faction>-<type>`
   composites for the stat block).
6. **Result sheet** — the parchment sheet, print-ready A4, one row per player:
   seat, name, faction crest, faction, hero, class. Plus **Copy as text** for
   pasting into Discord, and the draft code for the record.

Throughout: the top bar, language picker and dark chrome of the Scenario Editor,
so the three apps read as one family.

---

## 8. Matching the Scenario Editor's style

Copied wholesale, not reinvented:

- **Stack** — Next.js 15 App Router, React 19, TypeScript `strict`,
  `output: "export"`, `basePath` from `NEXT_BASE_PATH`, `images.unoptimized`.
- **`src/lib/assets.ts`** — the `asset()` base-path helper, verbatim.
- **`src/lib/i18n/`** — provider, `locales.ts`, `LanguagePicker.tsx`,
  `Flag.tsx`, all 14 locales. English complete; the rest fall back per key, so
  they can be filled in later without breaking anything.
- **`src/app/globals.css`** — one plain stylesheet, no CSS modules, no Tailwind.
  Same tokens (`--ink --gold --parchment --chrome --rule --danger`), same
  two-worlds structure: dark app chrome on screen, parchment sheet for print.
- **Fonts** — Liberation Serif woff2 from `/public/fonts`, `@font-face`
  declared in `layout.tsx` (a stylesheet can't see the base path).
- **Persistence** — `localStorage` under `homm3bg-drafter.*`, every load going
  through a `sanitizeX()` that fills an untrusted object onto the current
  template and returns `null` only when something truly unrecoverable is
  missing. Mirrors `sanitizeScenario`.
- **Comments** — the editor's habit of explaining *why*, not *what*. Worth
  preserving; the constraint and determinism code needs it more than the editor
  did.
- **Repo furniture** — same `.github/workflows/deploy.yml` (including
  `touch out/.nojekyll`), same `.gitignore`, same `.claude/launch.json`, same
  README shape (About / Using it / Development / Credits).

One deliberate deviation: **add a test runner** (`vitest`). The sibling apps have
none and don't need one, but this app's engine has invariants that must never
break — "no two players share a faction" is not something to verify by playing.
See §11.

---

## 9. Repository layout

```
.claude/launch.json
.github/workflows/deploy.yml
docs/PLAN.md                        <- this file
public/
  fonts/                            copied from the editor
  layout/                           parchment, banner, footer
  factions/<id>.webp                crests (see §10)
  heroes/hero_stats-<faction>-<klass>.webp   from the Hero Randomizer
src/app/{layout,page}.tsx
src/app/globals.css
src/components/
  DraftSetup.tsx      lobby + feasibility
  SeatStrip.tsx       who is in, what they have
  BanBoard.tsx
  PickBoard.tsx       one component, faction and hero phases
  FactionCard.tsx  HeroCard.tsx
  ResultSheet.tsx     the printable parchment
  ShareBar.tsx        code, URL, QR, copy
  LanguagePicker.tsx  Flag.tsx      copied
src/data/
  factions.json  heroes.json
src/lib/
  draftTypes.ts       types above
  draftConfig.ts      defaults, sanitize, feasibility()
  draftEngine.ts      reduce(), pools(), legalMoves(), stateHash()
  rng.ts              mulberry32 + a string->seed hash
  draftCode.ts        encode/decode, Crockford base32
  session.ts          localStorage
  transport/
    index.ts          the Transport interface + factory
    local.ts          hotseat
    manual.ts         code passing
    p2p.ts            Trystero
  assets.ts  i18n/    copied
tests/
  engine.test.ts  code.test.ts  feasibility.test.ts
```

Single route, hash-driven phases — no `generateStaticParams`, no dynamic route
segments, nothing that fights `output: "export"`.

---

## 10. Data sourcing

**Factions (10 today, 13 announced).** Castle, Rampart, Tower, Inferno,
Necropolis, Dungeon, Stronghold, Fortress, Conflux, Cove — with Factory, Bulwark
and Forge [announced by Archon](https://archon-studio.com/blog/homm3/heroes-might-magic-3-board-game-factory-bulwark-forge-expansions-announcement).
So the catalogue is a **JSON file, not a TypeScript union** — adding a faction
must be a data edit, not a code change.

**Heroes.** Roughly 60 across the ten factions, each with a faction and a
might/magic class, listed on [en.homm3bg.wiki](https://en.homm3bg.wiki/heroes/)
(the rendered form of [Mirzipan/Homm3_BG_Database](https://github.com/Mirzipan/Homm3_BG_Database),
which is also the source the Hero Randomizer credits).

Plan: a `scripts/build-heroes.mjs` that scrapes that table once into
`src/data/heroes.json`, committed to the repo — the same pattern as the Hero
Randomizer's `build-assets.mjs`, but run on demand rather than on every build,
so the app never depends on a third-party site being up. **The scraped roster
must be checked by hand against the cards before shipping** — the counts on the
wiki page are internally inconsistent, and the cross-faction heroes (Tarnum,
Lord Haart) need their `identity` field set correctly or `uniqueHeroIdentity`
will not do its job.

**Art.**
- *Faction crests* — none of the local repos has a clean crest set. Start with a
  colour + name treatment in the Mission Book style (which is honest, prints
  well and ships immediately), and drop in crops of the
  [rulebook's `assets/box-covers/*-box.png`](https://github.com/Heegu-sama/Homm3BG)
  as a later pass.
- *Hero stat blocks* — reuse `hero_stats-<faction>-<might|magic>.webp` from the
  Hero Randomizer directly. Twenty files, already composited, already fan-made.
- *Portraits* — not in scope for v1. Names plus crest plus class icon is enough
  to draft, and skipping ~60 card images keeps the repo small and the licensing
  simple.

---

## 11. Testing

The engine is pure, deterministic and has invariants worth defending. Property
tests over randomly generated configs:

- **P1** For every legal config and every sequence of legal moves, no two seats
  finish with the same faction.
- **P2** Under `heroFactionPolicy: "own"`, every hero's faction equals its
  player's faction.
- **P3** Under `uniqueHeroIdentity`, no two seats share a hero identity.
- **P4** A draft never deadlocks: at every point before `done`, the seat to move
  has at least one legal option. (This is the property `feasibility()` exists to
  guarantee up front — the test is what proves the two agree.)
- **P5** `decode(encode(x)) === x` for random configs and logs.
- **P6** `reduce()` is deterministic: same inputs, same `stateHash`, across
  1000 random runs.
- **P7** Format A pools are pairwise disjoint.

Run in CI on the same workflow that deploys, gating the deploy.

---

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| WebRTC blocked by a player's network | Live mode unusable for that player | Fall back to code passing automatically, with a visible reason. Format A only needs two codes total |
| Public Nostr/MQTT relay churn | Peers fail to find each other | Trystero rotates relays; on failure, show the manual code path rather than spinning |
| Player closes the tab mid-draft | Draft stalls | Log is in `localStorage` under the draft id; reopening the link resumes. Others can also carry on and re-share the code |
| Config that can't be dealt | Confusing dead end | `feasibility()` blocks it in the lobby with the arithmetic spelled out and a concrete fix offered |
| Clients on different builds desync | Silent divergence | `stateHash` exchanged with every event; visible banner + "reload from code" |
| Hero roster wrong or out of date | Wrong draft | Data lives in JSON with a documented refresh script; wrong entries are a data fix, not a code fix |
| Faction count grows to 13 | — | Already handled: everything reads from `factions.json` |

---

## 13. Milestones

| # | Deliverable | Why it's a good stopping point |
|---|---|---|
| **M0** ✅ | Scaffold: Next 15 static export, base-path helper, deploy workflow, globals.css tokens, i18n copied, empty page that builds and deploys | The Pages pipeline is proven before any logic exists |
| **M1** ✅ | `factions.json` + `heroes.json` + `scripts/build-catalogue.mjs` | Data problems surface early, not during UI work |
| **M2** ✅ | `rng.ts`, `draftEngine.ts`, `draftConfig.ts`, `draftCode.ts` + 35 tests covering §11 | The rules are correct and provably so, with no UI in the way |
| **M3** ✅ | Full UI on **local/hotseat** transport: lobby → ban → faction → hero → printable result sheet, plus resume-from-code and localStorage autosave | **Genuinely useful already** — one laptop passed around the table |
| **M4** | The rest of the `manual` transport: URLs, QR, seat claiming | Multi-computer drafting without passing a laptop |
| **M5** | `p2p` transport via Trystero: presence, live turn passing, desync banner, automatic fallback to M4 | The experience you actually want |
| **M6** | Polish: 14 locales filled, faction crest art, hero stat blocks, optional commit-reveal blind bans | Matches the sibling apps' finish |

M3 is the point where the app stops being a plan and starts being usable; M4 is
the point where it answers the original question. M5 is comfort.

**Built so far: M0–M3.** Two computers can already draft together by passing
the code that the result sheet prints — a whole draft, settings and moves,
round-trips through about a hundred characters of Crockford base32. What M4
adds is not making that possible but making it pleasant: a link instead of a
code, a QR for phones, and each player claiming a seat rather than one browser
holding the whole table.

Two things worth recording from building the engine, because both were caught
by a test rather than by thinking:

- **Dealt pools have to be dealt from the table as it stood before anyone
  picked.** Deriving them from the current state re-shuffled everybody else's
  options every time a neighbour took a faction. Disjointness means they never
  have to move, so they do not.
- **Config lists need a canonical order.** `factionIds` seeds the shuffle, so
  two clients holding the same ten factions in a different order deal each
  other different games — and the draft code, which stores them as a bitmap,
  would not round-trip. `sanitizeConfig` now sorts them, always.

---

## 14. Decisions

Settled before implementation started:

1. **Hero rule default** — `heroFactionPolicy: "own"`. A hero is always drafted
   from the player's own faction. The other two policies are still built and
   selectable; this is just what a fresh draft starts with. Because hero pools
   are then per-faction, the hero step inherits Format A's zero-sync property.
2. **Live sync** — P2P via Trystero, with automatic fallback to code passing
   when a network blocks WebRTC. No Cloudflare relay for now; §3.3 D stays the
   documented escape hatch if the public relays disappoint in practice.
3. **Build order** — M0 through M3 first: scaffold, data, tested engine, and the
   complete hotseat UI through to the printable result sheet.

Still open, and cheap to change later:

- **Player count ceiling** — building 2–8 (house rules and the announced
  13-faction future) rather than the box's 2–4. Affects the feasibility table,
  not the code.
- **Drafting other categories** — starting bonus, map, scenario. The engine is
  generic over categories, so a third drafted category is cheap to add if it
  turns out to be wanted.
