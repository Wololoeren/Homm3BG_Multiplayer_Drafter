"use client";

import { useEffect, useMemo, useState } from "react";
import DraftSetup from "@/components/DraftSetup";
import LanguagePicker from "@/components/LanguagePicker";
import PickBoard from "@/components/PickBoard";
import ResumeBar from "@/components/ResumeBar";
import ResultSheet from "@/components/ResultSheet";
import SeatStrip from "@/components/SeatStrip";
import { defaultConfig } from "@/lib/draftConfig";
import { canMove, reduce } from "@/lib/draftEngine";
import type { DraftConfig, DraftEvent, DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import { makeSeed } from "@/lib/rng";
import { clearSession, loadSession, loadSetup, saveSession, saveSetup } from "@/lib/session";

/**
 * The whole app is one page: the draft's phase decides what is on screen, so
 * there are no routes to keep in step with a static export, and no way to land
 * on a URL that describes a draft that is not the one in progress.
 *
 * This is the local transport of docs/PLAN.md §3.4 — one screen passed round
 * the table. Everything it does goes through the same (config, seed, log)
 * that a networked transport will carry, so adding one later changes how
 * events arrive and nothing about what they mean.
 */
export default function Page() {
  const t = useT();
  const [config, setConfig] = useState<DraftConfig>(defaultConfig);
  const [names, setNames] = useState<string[]>([]);
  const [seed, setSeed] = useState("");
  const [events, setEvents] = useState<DraftEvent[]>([]);
  const [ready, setReady] = useState(false);
  // Hotseat: the next player has to pick the screen up before they see what
  // they were dealt, or the person still holding it sees it first.
  const [revealed, setRevealed] = useState(false);

  // Everything lives in localStorage, so the first render waits for the client.
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setConfig(session.config);
      setSeed(session.seed);
      setEvents(session.events);
      setNames(
        Array.from({ length: session.config.players }, (_, i) => {
          const join = session.events.find((e) => e.t === "join" && e.seat === i);
          return join && join.t === "join" ? join.name : "";
        }),
      );
    } else {
      const saved = loadSetup() ?? defaultConfig();
      setConfig(saved);
      setNames(Array.from({ length: saved.players }, () => ""));
      setSeed(makeSeed());
    }
    setReady(true);
  }, []);

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

  useEffect(() => {
    if (!ready || !seed) return;
    if (started) saveSession({ config, seed, events, mySeat: null });
  }, [ready, started, config, seed, events]);

  function changeConfig(next: DraftConfig) {
    setConfig(next);
    saveSetup(next);
    if (next.players !== names.length) {
      setNames(Array.from({ length: next.players }, (_, i) => names[i] ?? ""));
    }
  }

  function start() {
    const joins: DraftEvent[] = names
      .slice(0, config.players)
      .map((name, seat) => ({ t: "join", seat, name: name.trim() }));
    setEvents([...joins, { t: "start" }]);
    setRevealed(false);
  }

  function move(event: DraftEvent) {
    setEvents((log) => [...log, event]);
    setRevealed(false);
  }

  function undo() {
    setEvents((log) => [...log, { t: "undo" }]);
    setRevealed(false);
  }

  function again() {
    setSeed(makeSeed());
    setEvents((log): DraftEvent[] => [...log.filter((e) => e.t === "join"), { t: "start" }]);
    setRevealed(false);
  }

  function backToSetup() {
    clearSession();
    setEvents([]);
    setSeed(makeSeed());
    setRevealed(false);
  }

  function resume(next: { config: DraftConfig; seed: string; events: DraftEvent[] }) {
    setConfig(next.config);
    setSeed(next.seed);
    setEvents(next.events);
    setNames(
      Array.from({ length: next.config.players }, (_, i) => {
        const join = next.events.find((e) => e.t === "join" && e.seat === i);
        return join && join.t === "join" ? join.name : "";
      }),
    );
    setRevealed(false);
  }

  const activeSeat =
    state && state.phase !== "lobby" && state.phase !== "done"
      ? (state.turn ?? state.order.find((i) => canMove(state, i)) ?? null)
      : null;

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
            onChange={changeConfig}
            onNames={setNames}
            onReroll={() => setSeed(makeSeed())}
            onReset={() => changeConfig(defaultConfig())}
            onStart={start}
          />
          <ResumeBar onResume={resume} />
        </>
      ) : state.phase === "done" ? (
        <ResultSheet state={state} events={events} onAgain={again} onNewSetup={backToSetup} />
      ) : (
        <>
          <SeatStrip
            state={state}
            activeSeat={activeSeat}
            hideChoices={state.config.banVisibility === "blind"}
          />
          {activeSeat === null ? null : revealed ? (
            <>
              <PickBoard state={state} seatIndex={activeSeat} onMove={move} />
              <div className="shareBar">
                <button
                  type="button"
                  className="btn"
                  disabled={!events.some((e) => e.t === "ban" || e.t === "pickF" || e.t === "pickH")}
                  onClick={undo}
                >
                  {t("draft.undo")}
                </button>
                <button type="button" className="btn" onClick={backToSetup}>
                  {t("result.newSetup")}
                </button>
              </div>
            </>
          ) : (
            <div className="hotseat">
              <h2>
                {t("draft.hotseat", {
                  name:
                    state.seats[activeSeat].name || t("draft.seat", { n: activeSeat + 1 }),
                })}
              </h2>
              <p className="hint">
                {state.turn === null ? t("draft.simultaneous") : t("draft.yourTurn")}
              </p>
              <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
                {t("draft.ready")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
