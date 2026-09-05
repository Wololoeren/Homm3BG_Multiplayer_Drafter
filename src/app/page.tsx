"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DraftSetup from "@/components/DraftSetup";
import LanguagePicker from "@/components/LanguagePicker";
import LiveBar from "@/components/LiveBar";
import PickBoard from "@/components/PickBoard";
import ResumeBar from "@/components/ResumeBar";
import ResultSheet from "@/components/ResultSheet";
import SeatClaim from "@/components/SeatClaim";
import SeatStrip from "@/components/SeatStrip";
import ShareBar from "@/components/ShareBar";
import WaitingPanel from "@/components/WaitingPanel";
import { decodeDraft, encodeDraft } from "@/lib/draftCode";
import { defaultConfig } from "@/lib/draftConfig";
import { canMove, reduce } from "@/lib/draftEngine";
import { acceptEvents, canonicalise } from "@/lib/draftLog";
import { copyText } from "@/lib/clipboard";
import { draftUrl, parseHash, replaceHash } from "@/lib/draftUrl";
import type { DraftConfig, DraftEvent, DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import { makeSeed } from "@/lib/rng";
import { clearSession, loadSession, loadSetup, saveSession, saveSetup } from "@/lib/session";
import type { Dispatch, TransportKind } from "@/lib/transport";
import { useLiveDraft } from "@/lib/useLiveDraft";

/**
 * One page, three ways to play it.
 *
 * The app never branches on *how* a move arrived — every move, whether it came
 * from a click, a pasted link or a peer, goes through `receive`, which folds
 * it into the log and lets the engine decide whether it was legal. What the
 * mode changes is only who is looking at the screen: one table (local), one
 * player who hands on a link (manual), or one player watching the others move
 * live (p2p).
 */
export default function Page() {
  const t = useT();
  const [config, setConfig] = useState<DraftConfig>(defaultConfig);
  const [names, setNames] = useState<string[]>([]);
  const [seed, setSeed] = useState("");
  const [events, setEvents] = useState<DraftEvent[]>([]);
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [mode, setMode] = useState<TransportKind>("local");
  const [ready, setReady] = useState(false);
  // Hotseat only: the next player has to pick the screen up before they see
  // what they were dealt, or the person still holding it sees it first.
  const [revealed, setRevealed] = useState(false);
  // Abandoning throws away a draft, so it asks first.
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  // In link mode, the hand-off link is put on the clipboard the moment a move
  // is made. Which seat it was for, and whether the browser allowed it.
  const [handover, setHandover] = useState<{ seat: number; copied: boolean } | null>(null);
  // What we last put in the address bar, so our own writes do not read back
  // as somebody handing us a new link.
  const ourHash = useRef("");
  // The draft this browser is currently in, for the hashchange listener to
  // compare against without re-subscribing on every move.
  const currentSeed = useRef("");

  const load = useCallback((draft: { config: DraftConfig; seed: string; events: DraftEvent[] }) => {
    currentSeed.current = draft.seed;
    setConfig(draft.config);
    setSeed(draft.seed);
    setEvents(canonicalise(draft.config, draft.seed, draft.events));
    setNames(
      Array.from({ length: draft.config.players }, (_, i) => {
        const join = draft.events.find((e) => e.t === "join" && e.seat === i);
        return join && join.t === "join" ? join.name : "";
      }),
    );
    setRevealed(false);
    setHandover(null);
  }, []);

  // A link in the address bar wins over whatever this browser was last doing:
  // somebody has just been handed a draft and that is the one they want.
  useEffect(() => {
    const link = typeof window !== "undefined" ? parseHash(window.location.hash) : null;
    if (link) {
      try {
        load(decodeDraft(link.code));
        setMySeat(link.seat);
        setMode(link.live ? "p2p" : "manual");
        setReady(true);
        return;
      } catch {
        // A link that will not open falls through to whatever was saved,
        // rather than dumping someone on an error page.
      }
    }

    const session = loadSession();
    if (session) {
      load(session);
      setMySeat(session.mySeat);
      setMode(session.mode);
    } else {
      const saved = loadSetup() ?? defaultConfig();
      const fresh = makeSeed();
      setConfig(saved);
      setNames(Array.from({ length: saved.players }, () => ""));
      currentSeed.current = fresh;
      setSeed(fresh);
    }
    setReady(true);
  }, [load]);

  const state: DraftState | null = useMemo(() => {
    if (!seed) return null;
    try {
      return reduce(config, seed, events);
    } catch {
      // A log that will not replay is a log to walk away from — the setup
      // screen is always reachable, and the draft code is still on screen.
      return null;
    }
  }, [config, seed, events]);

  const started = events.some((e) => e.t === "start");
  const setupCode = useMemo(() => (seed ? encodeDraft(config, seed) : ""), [config, seed]);
  const fullCode = useMemo(
    () => (seed ? encodeDraft(config, seed, events) : ""),
    [config, seed, events],
  );

  /** The one door every move comes through, local or remote. */
  const receive = useCallback(
    (incoming: readonly DraftEvent[]) => {
      setEvents((log) => acceptEvents(config, seed, log, incoming).log);
    },
    [config, seed],
  );

  useEffect(() => {
    if (!ready || !seed || !started) return;
    saveSession({ config, seed, events, mySeat, mode });
  }, [ready, started, config, seed, events, mySeat, mode]);

  // The address bar holds the whole draft, which is what makes a link a wire
  // in manual mode — and a free fallback in every other mode.
  useEffect(() => {
    if (!ready || !started || !fullCode) return;
    ourHash.current = replaceHash({ code: fullCode, seat: mySeat, live: mode === "p2p" });
  }, [ready, started, fullCode, mySeat, mode]);

  // Somebody pasting a link into the same tab is how a move arrives in manual
  // mode — and how a second draft gets opened in a tab that already had one.
  // The seed says which of those it is: the same draft merges, because a move
  // made here since is still ours, and a different one replaces outright.
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash;
      if (hash === ourHash.current) return;
      const link = parseHash(hash);
      if (!link) return;
      try {
        const draft = decodeDraft(link.code);
        if (link.live) setMode("p2p");
        if (draft.seed === currentSeed.current) {
          if (link.seat !== null) setMySeat(link.seat);
          setEvents((log) => acceptEvents(draft.config, draft.seed, log, draft.events).log);
        } else {
          load(draft);
          setMySeat(link.seat);
        }
      } catch {
        // Not a link this build can read; leave the draft alone.
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [load]);

  const dispatch: Dispatch = useMemo(
    () => ({
      seat: mySeat,
      setup: setupCode,
      events,
      hash: state?.hash ?? "",
      count: events.length,
    }),
    [mySeat, setupCode, events, state?.hash],
  );

  const live = useLiveDraft({
    live: mode === "p2p" && started && Boolean(setupCode),
    room: setupCode,
    payload: dispatch,
    onDispatch: (incoming) => receive(incoming.events),
  });

  function changeConfig(next: DraftConfig) {
    setConfig(next);
    saveSetup(next);
    if (next.players !== names.length) {
      setNames(Array.from({ length: next.players }, (_, i) => names[i] ?? ""));
    }
    if (mySeat !== null && mySeat >= next.players) setMySeat(next.players - 1);
  }

  function start() {
    const joins: DraftEvent[] = names
      .slice(0, config.players)
      .map((name, seat) => ({ t: "join", seat, name: name.trim() }));
    setEvents(canonicalise(config, seed, [...joins, { t: "start" }]));
    setRevealed(false);
  }

  function move(event: DraftEvent) {
    const next = acceptEvents(config, seed, events, [event]).log;
    setEvents(next);
    setRevealed(false);
    if (mode === "manual") handOver(next);
  }

  /**
   * Link mode's whole loop is "move, then send the link on", so the sending
   * half should not be a second thing to remember. The copy happens here
   * rather than in an effect because it has to stay inside the click that made
   * the move: a browser will refuse a clipboard write that has drifted out of
   * the gesture that asked for it.
   */
  function handOver(log: DraftEvent[]) {
    let next: DraftState;
    try {
      next = reduce(config, seed, log);
    } catch {
      return;
    }
    // Nothing to hand on at the end, and nothing to hand on to yourself.
    if (next.phase === "done") return;
    const seat = next.turn ?? next.order.find((i) => canMove(next, i)) ?? null;
    if (seat === null || seat === mySeat) return;

    const url = draftUrl({ code: encodeDraft(config, seed, log), seat, live: false });
    void copyText(url).then((copied) => setHandover({ seat, copied }));
  }

  /**
   * Undo is a hotseat convenience and stays one: it drops the last move from
   * the log, and a log is a set, so there is nothing to send anybody. Taking
   * back somebody else's move over a wire is a different feature with its own
   * arguments, and this is not it — the button is hidden in the other modes.
   */
  function undo() {
    setEvents((log) => {
      const canonical = canonicalise(config, seed, log);
      for (let i = canonical.length - 1; i >= 0; i--) {
        const kind = canonical[i].t;
        if (kind === "ban" || kind === "pickF" || kind === "pickH") {
          return [...canonical.slice(0, i), ...canonical.slice(i + 1)];
        }
      }
      return log;
    });
    setRevealed(false);
  }

  function again() {
    const fresh = makeSeed();
    currentSeed.current = fresh;
    setSeed(fresh);
    setEvents(canonicalise(config, fresh, [...events.filter((e) => e.t === "join"), { t: "start" }]));
    setRevealed(false);
  }

  function backToSetup() {
    const fresh = makeSeed();
    clearSession();
    setEvents([]);
    currentSeed.current = fresh;
    setSeed(fresh);
    setRevealed(false);
    setConfirmAbandon(false);
    setHandover(null);
    if (typeof window !== "undefined") {
      ourHash.current = "";
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  const hotseat = mode === "local" || mySeat === null;
  const activeSeat =
    state && state.phase !== "lobby" && state.phase !== "done"
      ? (state.turn ?? state.order.find((i) => canMove(state, i)) ?? null)
      : null;
  const iCanMove = state !== null && mySeat !== null && canMove(state, mySeat);
  const undoable = events.some((e) => e.t === "ban" || e.t === "pickF" || e.t === "pickH");

  function board() {
    if (!state) return null;

    // Arrived on a shared link that did not say which player you are.
    if (mode !== "local" && mySeat === null) {
      return (
        <SeatClaim
          state={state}
          takenSeats={live.peerSeats}
          onClaim={setMySeat}
          onHotseat={() => setMode("local")}
        />
      );
    }

    if (!hotseat) {
      return iCanMove ? (
        <PickBoard state={state} seatIndex={mySeat!} onMove={move} />
      ) : (
        <WaitingPanel
          state={state}
          mySeat={mySeat!}
          waitingOn={activeSeat}
          handover={handover && handover.seat === activeSeat ? handover : null}
        />
      );
    }

    if (activeSeat === null) return null;
    if (revealed) return <PickBoard state={state} seatIndex={activeSeat} onMove={move} />;
    return (
      <div className="hotseat">
        <h2>
          {t("draft.hotseat", {
            name: state.seats[activeSeat].name || t("draft.seat", { n: activeSeat + 1 }),
          })}
        </h2>
        <p className="hint">{state.turn === null ? t("draft.simultaneous") : t("draft.yourTurn")}</p>
        <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
          {t("draft.ready")}
        </button>
      </div>
    );
  }

  /**
   * Leaving a draft before it is finished.
   *
   * Available in every mode and at every phase, because "we set this up wrong"
   * happens two picks in as often as it happens at the end — and until now the
   * only way out was to play the draft to its finish. It asks first: the log is
   * the draft, and dropping it is not something to do on a mis-click.
   */
  function draftActions() {
    if (confirmAbandon) {
      return (
        <div className="note bad">
          <p style={{ margin: 0 }}>{t("draft.abandon.confirm")}</p>
          {mode !== "local" && (
            <p className="hint" style={{ marginBottom: 10 }}>
              {t("draft.abandon.shared")}
            </p>
          )}
          <div className="shareBar" style={{ borderTop: "none", padding: 0 }}>
            <button type="button" className="btn" onClick={backToSetup}>
              {t("draft.abandon.yes")}
            </button>
            <button type="button" className="btn primary" onClick={() => setConfirmAbandon(false)}>
              {t("draft.abandon.no")}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="shareBar">
        {hotseat && (
          <button type="button" className="btn" disabled={!undoable} onClick={undo}>
            {t("draft.undo")}
          </button>
        )}
        <button type="button" className="btn" onClick={() => setConfirmAbandon(true)}>
          {t("draft.abandon")}
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topBar">
        <div className="brand">
          <h1>{t("app.title")}</h1>
          <p>{t("app.subtitle")}</p>
        </div>
        <LanguagePicker />
      </header>

      {!ready || !state ? null : !started ? (
        <>
          <DraftSetup
            config={config}
            names={names}
            seed={seed}
            mode={mode}
            mySeat={mySeat}
            onChange={changeConfig}
            onNames={setNames}
            onMode={setMode}
            onSeat={setMySeat}
            onReroll={() => {
              const fresh = makeSeed();
              currentSeed.current = fresh;
              setSeed(fresh);
            }}
            onReset={() => changeConfig(defaultConfig())}
            onStart={start}
          />
          <ResumeBar onResume={load} />
        </>
      ) : state.phase === "done" ? (
        <>
          <ResultSheet state={state} events={events} onAgain={again} onNewSetup={backToSetup} />
          {mode !== "local" && (
            <ShareBar state={state} code={fullCode} mode={mode} mySeat={mySeat} nextSeat={null} />
          )}
        </>
      ) : (
        <>
          <SeatStrip
            state={state}
            activeSeat={activeSeat}
            mySeat={mySeat}
            hideChoices={state.config.banVisibility === "blind"}
          />
          {mode === "p2p" && (
            <LiveBar
              state={state}
              status={live.status}
              peerSeats={live.peerSeats}
              divergence={live.divergence}
              onDismiss={live.dismiss}
            />
          )}
          {board()}
          {draftActions()}
          {mode !== "local" && mySeat !== null && (
            <ShareBar
              state={state}
              code={fullCode}
              mode={mode}
              mySeat={mySeat}
              nextSeat={activeSeat}
            />
          )}
          {mode === "p2p" && live.status === "failed" && <p className="note">{t("live.fallback")}</p>}
        </>
      )}
    </div>
  );
}
