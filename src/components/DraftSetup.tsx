"use client";

import { FACTIONS, HEROES, SETS, setLabel } from "@/lib/catalogue";
import { feasibility, repair } from "@/lib/draftConfig";
import {
  HERO_POOL_ALL,
  MAX_BANS,
  MAX_HERO_BANS,
  MAX_PLAYERS,
  MAX_POOL,
  MIN_PLAYERS,
  type DraftConfig,
} from "@/lib/draftTypes";
import { useT, type Translate } from "@/lib/i18n";
import type { TransportKind } from "@/lib/transport";
import type { MessageKey } from "@/lib/i18n/messages/en";

interface Props {
  config: DraftConfig;
  names: string[];
  seed: string;
  mode: TransportKind;
  mySeat: number | null;
  onChange: (config: DraftConfig) => void;
  onNames: (names: string[]) => void;
  onMode: (mode: TransportKind) => void;
  onSeat: (seat: number | null) => void;
  onReroll: () => void;
  onReset: () => void;
  onStart: () => void;
}

const MODES: TransportKind[] = ["local", "manual", "p2p"];

/** Whether anybody has recorded which heroes share a card yet. Until they
 * have, the setting has nothing to act on and says so rather than pretending. */
const HAVE_CARD_PAIRINGS = HEROES.some((h) => h.pairedWith);

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * A row of numbers to choose between, which is faster to hit than a slider and
 * shows the whole range at once — the range being small enough to.
 *
 * A value that cannot work is greyed rather than hidden, so the shape of the
 * limit stays visible: five players cannot each be offered three of eleven
 * factions, and watching 3, 4 and 5 go dim as the table fills says why far
 * better than a sentence would.
 */
function NumberRow({
  value,
  from,
  to,
  onPick,
  labelFor,
  isDisabled,
  titleFor,
}: {
  value: number;
  from: number;
  to: number;
  onPick: (n: number) => void;
  labelFor?: (n: number) => string;
  isDisabled?: (n: number) => boolean;
  titleFor?: (n: number) => string | undefined;
}) {
  return (
    <div className="segmented">
      {range(from, to).map((n) => {
        // Never grey the current value: it is what the draft is set to, and a
        // control that disables its own selection cannot be undone.
        const off = n !== value && (isDisabled?.(n) ?? false);
        return (
          <button
            key={n}
            type="button"
            className={n === value ? "active" : ""}
            disabled={off}
            title={off ? titleFor?.(n) : undefined}
            onClick={() => onPick(n)}
          >
            {labelFor ? labelFor(n) : n}
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="setupRow">
      <span className="label">{label}</span>
      <div>
        {children}
        {hint && <p className="hint">{hint}</p>}
      </div>
    </div>
  );
}

/** Turns a feasibility issue into the sentence that explains it. The numbers
 * travel with the issue precisely so this can say *why* rather than "no". */
function issueText(t: Translate, code: string, vars: Record<string, string | number>): string {
  return t(`feas.${code}` as MessageKey, vars);
}

export default function DraftSetup({
  config,
  names,
  seed,
  mode,
  mySeat,
  onChange,
  onNames,
  onMode,
  onSeat,
  onReroll,
  onReset,
  onStart,
}: Props) {
  const t = useT();
  const check = feasibility(config);

  // Every change is repaired on the way in, so raising the player count
  // shrinks the pools instead of leaving the player to unpick a red error.
  const set = (patch: Partial<DraftConfig>) => onChange(repair({ ...config, ...patch }));

  /**
   * Whether a setting can be chosen at all.
   *
   * Two different questions, deliberately. A pool size is asked about as it
   * stands — "can five players each be offered three factions?" — because that
   * is exactly what is being chosen. A player count or a ban budget is asked
   * about after repair, because those are facts about the table that the pools
   * should give way to, not preferences to be refused.
   */
  const poolFits = (patch: Partial<DraftConfig>) => feasibility({ ...config, ...patch }).ok;
  const tableFits = (patch: Partial<DraftConfig>) => feasibility(repair({ ...config, ...patch })).ok;

  const ownedSets = SETS.filter(
    (s) =>
      FACTIONS.some((f) => f.set === s && config.factionIds.includes(f.id)) ||
      HEROES.some((h) => h.set === s && config.heroIds.includes(h.id)),
  );

  function toggleSet(setId: string) {
    const on = ownedSets.includes(setId);
    const factionIds = FACTIONS.filter(
      (f) => (f.set === setId ? !on : config.factionIds.includes(f.id)),
    ).map((f) => f.id);
    const heroIds = HEROES.filter((h) => (h.set === setId ? !on : config.heroIds.includes(h.id))).map(
      (h) => h.id,
    );
    if (!factionIds.length) return;
    set({ factionIds, heroIds });
  }

  /**
   * Switching a faction off is refused when the table could not then be dealt
   * at all — the direct form of "five players cannot draft from three
   * factions", stopped before it happens rather than explained afterwards.
   */
  function canRemoveFaction(id: string) {
    const factionIds = config.factionIds.filter((f) => f !== id);
    return factionIds.length > 0 && feasibility(repair({ ...config, factionIds })).ok;
  }

  function toggleFaction(id: string) {
    const on = config.factionIds.includes(id);
    const factionIds = on
      ? config.factionIds.filter((f) => f !== id)
      : FACTIONS.filter((f) => f.id === id || config.factionIds.includes(f.id)).map((f) => f.id);
    if (!factionIds.length) return;
    set({ factionIds });
  }

  return (
    <div className="setup">
      <Row label={t("lobby.players")}>
        <NumberRow
          value={config.players}
          from={MIN_PLAYERS}
          to={MAX_PLAYERS}
          isDisabled={(players) => !tableFits({ players })}
          titleFor={() => t("lobby.tooManyPlayers", { factions: config.factionIds.length })}
          onPick={(players) => {
            set({ players });
            onNames(
              Array.from({ length: players }, (_, i) => names[i] ?? ""),
            );
          }}
        />
        <div className="collection" style={{ marginTop: 10 }}>
          {Array.from({ length: config.players }, (_, i) => (
            <input
              key={i}
              className="codeInput"
              style={{ flex: "0 1 150px" }}
              value={names[i] ?? ""}
              maxLength={24}
              placeholder={t("draft.seat", { n: i + 1 })}
              onChange={(e) => {
                const next = [...names];
                next[i] = e.target.value;
                onNames(next);
              }}
            />
          ))}
        </div>
      </Row>

      <Row label={t("lobby.mode")} hint={t(`lobby.mode.${mode}.help` as MessageKey)}>
        <div className="segmented">
          {MODES.map((option) => (
            <button
              key={option}
              type="button"
              className={mode === option ? "active" : ""}
              onClick={() => {
                onMode(option);
                // Every mode but the hotseat needs to know which of these
                // players is holding this browser.
                onSeat(option === "local" ? null : (mySeat ?? 0));
              }}
            >
              {t(`lobby.mode.${option}` as MessageKey)}
            </button>
          ))}
        </div>
        {mode !== "local" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 10 }}>
            <span className="label">{t("lobby.youAre")}</span>
            <div className="segmented">
              {Array.from({ length: config.players }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={mySeat === i ? "active" : ""}
                  onClick={() => onSeat(i)}
                >
                  {names[i]?.trim() || t("draft.seat", { n: i + 1 })}
                </button>
              ))}
            </div>
          </div>
        )}
      </Row>

      <Row
        label={t("lobby.format")}
        hint={t(config.format === "dealt" ? "lobby.format.dealt.help" : "lobby.format.snake.help")}
      >
        <div className="segmented">
          {(["dealt", "snake"] as const).map((format) => (
            <button
              key={format}
              type="button"
              className={config.format === format ? "active" : ""}
              onClick={() => set({ format })}
            >
              {t(`lobby.format.${format}` as MessageKey)}
            </button>
          ))}
        </div>
      </Row>

      <Row
        label={t("lobby.factionPool")}
        hint={config.factionPoolSize === 1 ? t("lobby.pool.forced") : undefined}
      >
        <NumberRow
          value={config.factionPoolSize}
          from={1}
          to={MAX_POOL}
          isDisabled={(factionPoolSize) => !poolFits({ factionPoolSize })}
          titleFor={(n) =>
            t("lobby.poolTooBig", {
              need: config.players * n,
              left: feasibility(config).factionsAfterBans,
            })
          }
          onPick={(factionPoolSize) => set({ factionPoolSize })}
        />
      </Row>

      <Row
        label={t("lobby.heroPool")}
        hint={
          config.heroPoolSize === HERO_POOL_ALL
            ? t("lobby.pool.all.help")
            : config.heroPoolSize === 1
              ? t("lobby.pool.forced")
              : undefined
        }
      >
        <div className="segmented">
          {range(1, MAX_POOL).map((n) => (
            <button
              key={n}
              type="button"
              className={n === config.heroPoolSize ? "active" : ""}
              disabled={n !== config.heroPoolSize && !poolFits({ heroPoolSize: n })}
              onClick={() => set({ heroPoolSize: n })}
            >
              {n}
            </button>
          ))}
          {/* "All" only makes sense when a seat draws from its own faction:
              anywhere else it would mean the whole sixty-four. */}
          {config.heroFactionPolicy === "own" && (
            <button
              type="button"
              className={config.heroPoolSize === HERO_POOL_ALL ? "active" : ""}
              onClick={() => set({ heroPoolSize: HERO_POOL_ALL })}
            >
              {t("lobby.pool.all")}
            </button>
          )}
        </div>
      </Row>

      <Row label={t("lobby.turns")} hint={t("lobby.turns.help")}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={config.combinedPicks}
            onChange={(e) => set({ combinedPicks: e.target.checked })}
          />
          <span>
            {t("lobby.combined")}
            <span className="hint" style={{ display: "block" }}>
              {t("lobby.combined.help")}
            </span>
          </span>
        </label>
        <label className="toggle" style={{ marginTop: 8 }}>
          <input
            type="checkbox"
            checked={config.draftSeats}
            onChange={(e) => set({ draftSeats: e.target.checked })}
          />
          <span>
            {t("lobby.draftSeats")}
            <span className="hint" style={{ display: "block" }}>
              {t("lobby.draftSeats.help")}
            </span>
          </span>
        </label>
      </Row>

      <Row
        label={t("lobby.heroBans")}
        hint={t(config.combinedPicks ? "lobby.heroBans.blindHelp" : "lobby.heroBans.help")}
      >
        <NumberRow
          value={config.heroBansPerPlayer}
          from={0}
          to={MAX_HERO_BANS}
          onPick={(heroBansPerPlayer) => set({ heroBansPerPlayer })}
          labelFor={(n) => (n === 0 ? t("lobby.bans.none") : String(n))}
        />
      </Row>

      <Row
        label={t("lobby.bans")}
        hint={
          config.bansPerPlayer > 0 || config.heroBansPerPlayer > 0
            ? t(`lobby.banVisibility.${config.banVisibility}.help` as MessageKey)
            : undefined
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <NumberRow
            value={config.bansPerPlayer}
            from={0}
            to={MAX_BANS}
            isDisabled={(bansPerPlayer) => !tableFits({ bansPerPlayer })}
            titleFor={() => t("lobby.tooManyBans", { players: config.players })}
            onPick={(bansPerPlayer) => set({ bansPerPlayer })}
            labelFor={(n) => (n === 0 ? t("lobby.bans.none") : String(n))}
          />
          {(config.bansPerPlayer > 0 || config.heroBansPerPlayer > 0) && (
            <div className="segmented">
              {(["open", "blind"] as const).map((banVisibility) => (
                <button
                  key={banVisibility}
                  type="button"
                  className={config.banVisibility === banVisibility ? "active" : ""}
                  onClick={() => set({ banVisibility })}
                >
                  {t(`lobby.banVisibility.${banVisibility}` as MessageKey)}
                </button>
              ))}
            </div>
          )}
        </div>
      </Row>

      <Row
        label={t("lobby.heroRule")}
        hint={t(`lobby.heroRule.${config.heroFactionPolicy}.help` as MessageKey)}
      >
        <div className="segmented">
          {(["own", "unique-faction", "any"] as const).map((policy) => (
            <button
              key={policy}
              type="button"
              className={config.heroFactionPolicy === policy ? "active" : ""}
                onClick={() =>
                set({
                  heroFactionPolicy: policy,
                  // "All" is an own-faction idea; leaving that rule has to
                  // leave it behind rather than quietly mean something else.
                  heroPoolSize:
                    policy !== "own" && config.heroPoolSize === HERO_POOL_ALL
                      ? 3
                      : config.heroPoolSize,
                })
              }
            >
              {t(`lobby.heroRule.${policy}` as MessageKey)}
            </button>
          ))}
        </div>
        <label className="toggle" style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={config.uniqueHeroIdentity}
            onChange={(e) => set({ uniqueHeroIdentity: e.target.checked })}
          />
          <span>
            {t("lobby.uniqueIdentity")}
            <span className="hint" style={{ display: "block" }}>
              {t("lobby.uniqueIdentity.help")}
            </span>
          </span>
        </label>
        {config.heroFactionPolicy === "unique-faction" && (
          <>
            <label className="toggle" style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                checked={config.heroMayComeFromAnotherPlayersTown}
                disabled={config.combinedPicks}
                onChange={(e) => set({ heroMayComeFromAnotherPlayersTown: e.target.checked })}
              />
              <span>
                {t("lobby.otherTowns")}
                {config.combinedPicks && (
                  <span className="hint" style={{ display: "block" }}>
                    {t("lobby.otherTowns.combined")}
                  </span>
                )}
              </span>
            </label>
          </>
        )}
        <label className="toggle" style={{ marginTop: 8 }}>
          <input
            type="checkbox"
            checked={config.sharedHeroCards}
            disabled={!HAVE_CARD_PAIRINGS}
            onChange={(e) => set({ sharedHeroCards: e.target.checked })}
          />
          <span>
            {t("lobby.sharedCards")}
            <span className="hint" style={{ display: "block" }}>
              {HAVE_CARD_PAIRINGS ? t("lobby.sharedCards.help") : t("lobby.sharedCards.nodata")}
            </span>
          </span>
        </label>
      </Row>

      <Row
        label={t("lobby.collection")}
        hint={t("lobby.collection.summary", {
          factions: config.factionIds.length,
          heroes: config.heroIds.length,
        })}
      >
        <div className="collection">
          {SETS.map((setId) => (
            <button
              key={setId}
              type="button"
              className={ownedSets.includes(setId) ? "chip on" : "chip"}
              onClick={() => toggleSet(setId)}
            >
              {setLabel(setId)}
            </button>
          ))}
        </div>
        <div className="collection" style={{ marginTop: 8 }}>
          {FACTIONS.map((f) => {
            const on = config.factionIds.includes(f.id);
            const stuck = on && !canRemoveFaction(f.id);
            return (
              <button
                key={f.id}
                type="button"
                className={on ? "chip on" : "chip"}
                disabled={stuck}
                title={stuck ? t("lobby.factionNeeded", { players: config.players }) : undefined}
                onClick={() => toggleFaction(f.id)}
              >
                <span className="chipDot" style={{ background: f.color }} />
                {f.name}
              </button>
            );
          })}
        </div>
      </Row>

      {check.ok ? (
        <p className="note good">
          {t("feas.ok", {
            players: config.players,
            left: check.factionsAfterBans,
            need: config.players * config.factionPoolSize,
          })}
        </p>
      ) : (
        <div className="note bad">
          {check.issues.map((issue, i) => (
            <p key={i} style={{ margin: i ? "6px 0 0" : 0 }}>
              {issueText(t, issue.code, issue.vars)}
            </p>
          ))}
        </div>
      )}

      <div className="setupActions">
        <span className="seedBox">
          {t("lobby.seed")} <span className="seedValue">{seed}</span>
          <button type="button" className="btn" onClick={onReroll}>
            {t("lobby.reroll")}
          </button>
        </span>
        <button type="button" className="btn" onClick={onReset}>
          {t("lobby.reset")}
        </button>
        <button type="button" className="btn primary" disabled={!check.ok} onClick={onStart}>
          {t("lobby.start")}
        </button>
      </div>
    </div>
  );
}
