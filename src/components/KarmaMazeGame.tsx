import { useEffect, useRef, useState } from "react";
import { generateMaze, generateLevel2Maze, type MazeCell } from "@/lib/karma-maze-generator";

const ASSET_BASE = "/games/karma-maze/assets";
const IMAGES = {
  snoo1: `${ASSET_BASE}/snoo1.png`,
  snoo2: `${ASSET_BASE}/snoo2.png`,
  karma: `${ASSET_BASE}/karma.png`,
  map: `${ASSET_BASE}/map.png`,
  crystal: `${ASSET_BASE}/crystal.png`,
  trap1: `${ASSET_BASE}/trap1.png`,
  trap2: `${ASSET_BASE}/trap2.png`,
  trap3: `${ASSET_BASE}/trap3.png`,
  doorCrack1: `${ASSET_BASE}/doorCrack1.png`,
  doorCrack2: `${ASSET_BASE}/doorCrack2.png`,
  doorCrack3: `${ASSET_BASE}/doorCrack3.png`,
};

const MAZE_WIDTH = 18;
const MAZE_HEIGHT = 9;

type Mode = 1 | 2; // 1 = Casual, 2 = Challenge

function buildMaze(mode: Mode, gamesPlayed: number): MazeCell[][] {
  return mode === 1
    ? generateMaze(MAZE_WIDTH, MAZE_HEIGHT)
    : generateLevel2Maze(MAZE_WIDTH, MAZE_HEIGHT, gamesPlayed, false);
}

export default function KarmaMazeGame() {
  const [view, setView] = useState<"menu" | "game" | "howToPlay">("menu");
  const [mode, setMode] = useState<Mode>(2);
  const [sessionKey, setSessionKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const modeRef = useRef<Mode>(mode);
  const gamesPlayedRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (view !== "game") return;

    const postInitialData = (
      maze: MazeCell[][],
      overrides: { isFirstGame?: boolean; isRetry?: boolean; isNewGame?: boolean } = {}
    ) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      const isCasualMode = modeRef.current === 1;
      win.postMessage(
        {
          type: "initialData",
          data: {
            username: "Player",
            keys: isCasualMode ? 99999 : 3,
            maze,
            level: modeRef.current,
            gamesPlayed: gamesPlayedRef.current,
            lives: livesRef.current,
            isCasualMode,
            playerImageUrl: isCasualMode ? IMAGES.snoo1 : IMAGES.snoo2,
            keyPowerupImageUrl: IMAGES.karma,
            mapImageUrl: IMAGES.map,
            crystalBallImageUrl: IMAGES.crystal,
            trap1ImageUrl: IMAGES.trap1,
            trap2ImageUrl: IMAGES.trap2,
            trap3ImageUrl: IMAGES.trap3,
            doorCrack1ImageUrl: IMAGES.doorCrack1,
            doorCrack2ImageUrl: IMAGES.doorCrack2,
            doorCrack3ImageUrl: IMAGES.doorCrack3,
            ...overrides,
          },
        },
        "*"
      );
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const message = event.data;
      if (!message || !message.type) return;

      switch (message.type) {
        case "ready":
          gamesPlayedRef.current = 0;
          livesRef.current = 3;
          postInitialData(buildMaze(modeRef.current, 0), { isNewGame: true, isFirstGame: true });
          break;

        case "retry":
          postInitialData(buildMaze(modeRef.current, gamesPlayedRef.current), {
            isRetry: true,
            isFirstGame: false,
          });
          break;

        case "nextGame":
          gamesPlayedRef.current += 1;
          if (typeof message.data?.lives === "number") livesRef.current = message.data.lives;
          postInitialData(buildMaze(modeRef.current, gamesPlayedRef.current), { isFirstGame: false });
          break;

        case "gameOver":
          if (typeof message.data?.lives === "number") livesRef.current = message.data.lives;
          break;

        case "newGame":
          setView("menu");
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [view]);

  const startGame = () => {
    gamesPlayedRef.current = 0;
    livesRef.current = 3;
    setSessionKey((k) => k + 1);
    setView("game");
  };

  return (
    <div className="not-prose w-full rounded-xl border border-border overflow-hidden bg-[#1a1a1a]">
      {view === "game" ? (
        <iframe
          key={sessionKey}
          ref={iframeRef}
          src="/games/karma-maze/maze.html"
          title="Karma Maze"
          className="w-full h-[480px] border-0 block"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 h-[480px] px-6 text-center">
          {view === "menu" ? (
            <>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-white text-lg font-semibold">Karma Maze</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Guide the Snoo through the maze, collecting karma and avoiding traps.
                </p>
              </div>

              <div className="flex items-center gap-1 border border-white/15 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setMode(1)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === 1 ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Casual
                </button>
                <button
                  type="button"
                  onClick={() => setMode(2)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === 2 ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Challenge
                </button>
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
                <li>Use WASD or click an adjacent cell to move</li>
                <li>Move into a door to unlock it (costs 1 karma)</li>
                <li>Collect karma orbs to unlock doors and disarm traps</li>
                <li>
                  <span className="text-white/80">Casual</span> mode has unlimited karma and no
                  traps, good for learning the maze
                </li>
                <li>
                  <span className="text-white/80">Challenge</span> mode races the clock, with
                  traps and fake exits that ramp up the more you play
                </li>
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
