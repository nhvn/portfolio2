import { useState } from "react";

export default function PumpkinGame() {
  const [view, setView] = useState<"menu" | "game" | "howToPlay">("menu");
  const [sessionKey, setSessionKey] = useState(0);

  const startGame = () => {
    setSessionKey((k) => k + 1);
    setView("game");
  };

  return (
    <div className="not-prose w-full rounded-xl border border-border overflow-hidden bg-black">
      {view === "game" ? (
        <iframe
          key={sessionKey}
          src="/games/pumpkin-lostte-game/index.html"
          title="Pumpkin Lostte"
          className="w-full h-[480px] border-0 block"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 h-[480px] px-6 text-center">
          {view === "menu" ? (
            <>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-white text-lg font-semibold">Pumpkin Lostte</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Guide Jerry through the maze of platforms to rescue his lost pumpkin.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[220px]">
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full h-9 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => setView("howToPlay")}
                  className="w-full h-9 rounded-lg border border-white/15 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  How to Play
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 max-w-sm">
              <h3 className="text-white text-lg font-semibold">How to Play</h3>
              <ul className="text-white/60 text-sm text-left flex flex-col gap-2 list-disc pl-4">
                <li>A / D or the on-screen arrows to move</li>
                <li>W or the up button to jump</li>
                <li>Some jumps are short hops, some need a running start</li>
                <li>Jump over the spikes — touching one ends the run</li>
                <li>Avoid the chaser trailing behind you</li>
                <li>Reach the pumpkin at the end to win</li>
              </ul>
              <button
                type="button"
                onClick={() => setView("menu")}
                className="h-9 px-4 rounded-lg border border-white/15 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
