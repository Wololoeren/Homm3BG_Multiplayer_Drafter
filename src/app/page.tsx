"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DraftSetup from "@/components/DraftSetup";
import LanguagePicker from "@/components/LanguagePicker";
import LiveBar from "@/components/LiveBar";
import PickBoard from "@/components/PickBoard";
import ResumeBar from "@/components/ResumeBar";
import SiteFooter from "@/components/SiteFooter";
import ResultSheet from "@/components/ResultSheet";
import SeatClaim from "@/components/SeatClaim";
import SeatStrip from "@/components/SeatStrip";
import ShareBar from "@/components/ShareBar";
import WaitingPanel from "@/components/WaitingPanel";
import { decodeDraft, encodeDraft } from "@/lib/draftCode";
import { defaultConfig } from "@/lib/draftConfig";
import { canMove, reduce } from "@/lib/draftEngine";
import { acceptEvents, canonicalise, eventKey } from "@/lib/draftLog";
import { copyText } from "@/lib/clipboard";
import { draftUrl, parseHash, replaceHash } from "@/lib/draftUrl";
import type { DraftConfig, DraftEvent, DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import { makeSeed } from "@/lib/rng";
import { clearSession, loadSession, loadSetup, saveSession, saveSetup } from "@/lib/session";
import type { Dispatch, TransportKind } from "@/lib/transport";
import { useLiveDraft } from "@/lib/useLiveDraft";

/** What counts as a move someone could take back. Joining and starting do not. */
const UNDOABLE: DraftEvent["t"][] = ["ban", "banH", "pickF", "pickH", "pickP"];

/**
 * How long a live move sits on this computer before the others hear about it.
 *
 * Live is the one mode where a move cannot be taken back afterwards: peers
 * merge whole logs as unions, so anything they have heard comes straight back
 * however firmly it is deleted here. Rather than build a tombstone everybody
 * has to agree on, the move is simply not sent yet — for five seconds it
 * exists on one computer, exactly like a shared link nobody has passed on.
 */
const LIVE_HOLD_SECONDS = 5;

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
  /** A live move made but not yet broadcast, and the seconds left to take it
   * back. Null at every other moment, including in the other two modes. */
  const [held, setHeld] = useState<{ event: DraftEvent; left: number } | null>(null);
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
    hold: held !== null,
    onDispatch: (incoming) => receive(incoming.events),
  });

  // The countdown itself. Reaching zero drops the hold, and dropping the hold
  // is what publishes — see useLiveDraft.
  useEffect(() => {
    if (!held) return;
    if (held.left <= 0) {
      setHeld(null);
      return;
    }
    const timer = setTimeout(() => setHeld((h) => (h ? { ...h, left: h.left - 1 } : null)), 1000);
    return () => clearTimeout(timer);
  }, [held]);

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
    // Applied here either way; live just keeps it to itself for a moment.
    if (mode === "p2p") setHeld({ event, left: LIVE_HOLD_SECONDS });
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
   * Taking a move back drops it from the log rather than appending anything,
   * because the log is a set: there is no event to send, and nothing for a
   * later merge to argue with. What may be dropped is `undoTarget`'s problem.
   */
  function undo() {
    if (!undoTarget) return;
    const key = eventKey(undoTarget);
    setEvents((log) => canonicalise(config, seed, log).filter((e) => eventKey(e) !== key));
    setRevealed(false);
    // Whatever link we told this player to pass on is no longer the one to
    // pass on, so the instruction goes with the move.
    setHandover(null);
    // And a move nobody is going to make needs no countdown to announce it.
    setHeld(null);
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
  /**
   * The move this browser may take back, if any.
   *
   * Round one screen it is simply the last move, because whoever is holding
   * the screen is the one who made it. On a shared link it has to be your own
   * *and* still the last anybody made: the log travels with the link, so a
   * move you have not passed on yet exists nowhere but here and costs nobody
   * anything to drop. Once it has gone out it is not yours to take back, and
   * the button goes quiet rather than pretending.
   *
   * Live gets the same window by a different route: the move it is holding,
   * for as long as it is holding it. Once that has gone out a peer will hand
   * it straight back however firmly it is deleted here, so the button goes
   * with the countdown.
   */
  const undoTarget = useMemo(() => {
    if (!state) return null;
    if (mode === "p2p") return held?.event ?? null;
    const canonical = canonicalise(config, seed, events);
    for (let i = canonical.length - 1; i >= 0; i--) {
      const event = canonical[i];
      if (!UNDOABLE.includes(event.t)) continue;
      if (mode === "local") return event;
      // A link you have not claimed a seat on is not yours to rewind.
      if (mySeat === null) return null;
      return "seat" in event && event.seat === mySeat ? event : null;
    }
    return null;
  }, [state, mode, config, seed, events, mySeat, held]);

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
        {(mode !== "p2p" || held) && (
          <button type="button" className="btn" disabled={!undoTarget} onClick={undo}>
            {t("draft.undo")}
          </button>
        )}
        <button type="button" className="btn" onClick={() => setConfirmAbandon(true)}>
          {t("draft.abandon")}
        </button>
        {mode === "manual" && <span className="hint">{t("draft.undo.shared")}</span>}
        {held && <span className="hint">{t("draft.sending", { n: held.left })}</span>}
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

      {!ready ? null : !state ? (
        /* A log that will not replay used to render nothing at all: no setup
           screen, no way out, and a saved session that brought the same empty
           page back on every reload. */
        <div className="note bad">
          <p style={{ margin: 0 }}>{t("draft.unreplayable")}</p>
          <div className="shareBar" style={{ borderTop: "none", padding: "10px 0 0" }}>
            <button type="button" className="btn primary" onClick={backToSetup}>
              {t("draft.unreplayable.reset")}
            </button>
          </div>
        </div>
      ) : !started ? (
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
            // Round one screen the browser belongs to whoever has just been
            // handed it, and between turns to nobody — which is exactly when
            // the strip must not be naming the last player's draft.
            seeing={hotseat ? (revealed ? activeSeat : null) : mySeat}
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
              /* Nobody to hand to while the draft is still waiting on you.
                 In a simultaneous phase `activeSeat` is whichever seat moves
                 first, which is somebody else long before your own move is
                 in — so it told you to send a link you had not earned yet,
                 and went on saying so after a move was taken back. */
              nextSeat={iCanMove ? null : activeSeat}
            />
          )}
          {mode === "p2p" && live.status === "failed" && <p className="note">{t("live.fallback")}</p>}
        </>
      )}

      <SiteFooter />
    </div>
  );
}
