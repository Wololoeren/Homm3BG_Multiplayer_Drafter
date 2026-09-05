# HoMM3 BG — Multiplayer Drafter

Give every player at the table a faction and a hero, drafted from randomly
dealt pools, with an optional ban phase — and never two players on the same
faction. A companion to the [Scenario Editor][editor] and the
[Random Scenario Generator][generator]: same stack, same chrome, and the
result prints on the same parchment.

Fan-made, not affiliated with Ubisoft or Archon Studio.

## Using it

- **Set up the draft** — players (2–8), how many options each of them is
  offered, how many bans, where heroes may come from, and which boxes you own.
  A line under the settings says whether what you have asked for can actually
  be dealt, with the arithmetic: *"4 players, 10 factions on the table — 8 of
  them dealt out."* Change something impossible and the pools shrink to fit
  rather than leaving you with an error to unpick.
- **Dealt or Snake.** *Dealt* shuffles once and hands every player a pool
  nobody else was offered, so everyone can pick at the same time and no two
  players can collide. *Snake* goes round the table one at a time, each player
  offered a fresh sample of whatever is still free — use it when there are not
  enough factions to deal everyone a real choice. Six players and ten factions
  cannot each be offered two, and the setup screen will say so.
- **Bans** — none, one or two each, taken off the table before the deal.
  *Open* bans go one at a time with everyone watching. *Blind* bans are all
  submitted at once and revealed together; two players can spend a ban on the
  same faction, and it is only removed once.
- **Heroes come from** — your own faction by default. Or from any faction
  with no two players' heroes sharing a home faction, or from anywhere at all.
  **One of each hero** is on by default and matters more than it looks:
  Tarnum has a card in six factions and Lord Haart in two, so without it two
  players can both end up as Tarnum from two different towns.
- **Passing the screen.** One browser runs the whole table: the app names
  whoever is next and waits for them to say they have the screen before it
  shows what they were dealt.
- **The draft code** on the result sheet is the whole draft — settings, seed
  and every move — in about a hundred characters. Paste it into **Resume a
  draft** on another computer and you get the same draft back, exactly. It is
  in Crockford's base32, which has no I, L, O or U in it, so it survives being
  read out over voice chat.
- **Save as PDF** prints the result sheet on A4, laid out like a page of the
  [Fan-Made Mission Book][mission-book]. **Copy as text** is for pasting into
  Discord.

Your draft is saved to the browser as you go, so a reload picks up where you
left off.

### What is not built yet

Live turn-by-turn play between computers. The draft engine is already
transport-agnostic and the draft code already carries a whole draft between
browsers, so what is missing is the wire, not the rules — see
[docs/PLAN.md](docs/PLAN.md) §3 for the analysis and the plan (peer-to-peer
WebRTC, no server, falling back to code passing).

## Development

```bash
npm install
npm run dev
```

`npm test` runs the engine's property tests, and the Pages workflow will not
deploy without them: "no two players share a faction" and "a feasible draft
never deadlocks" are the product, not details, and they are checked against a
few hundred randomly generated configurations rather than by playing a game.

`npm run build` produces a static export in `out/`. The GitHub Pages workflow
builds with `NEXT_BASE_PATH` set to the repository name so assets resolve
under `https://<user>.github.io/<repo>/`.

### Updating the data

`src/data/factions.json` and `src/data/heroes.json` are generated from the
community card database by `npm run data`, and committed. It is deliberately
**not** wired into `prebuild`: a roster that changed quietly between two
builds would make a draft wrong without anyone noticing, and the app should
not need a third-party site to be up in order to deploy. Run it on purpose,
read the diff, then commit.

Nothing else needs a code change when a faction is added — Archon has
announced Factory, Bulwark and Forge — except a colour for it in the script's
`FACTION_COLORS`, which the script will demand.

## Credits

- Faction and hero data: [Heroes of Might & Magic III: The Board Game Cards
  Database](https://github.com/Mirzipan/Homm3_BG_Database), rendered at
  [en.homm3bg.wiki](https://en.homm3bg.wiki/)
- Layout, fonts and artwork: [Fan-Made Mission Book][mission-book] and the
  [Rewritten Rule Book](https://github.com/Heegu-sama/Homm3BG)
- Chrome, stylesheet and i18n scaffolding: **Wololoeren**'s
  [Scenario Editor][editor]

[mission-book]: https://github.com/qwrtln/Homm3BG-mission-book
[editor]: https://github.com/Wololoeren/homm3BG_scenario_editor
[generator]: https://github.com/Wololoeren/Homm3BG-Random-Scenario-Generator
