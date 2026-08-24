// Ported from the original Devvit app's src/main.tsx maze generator.
// Pure functions, no Reddit/Devvit dependency, so they work unchanged client-side.

export type MazeCell =
  | "path"
  | "wall"
  | "door"
  | "start"
  | "exit"
  | "fake-exit"
  | "crystal-ball"
  | "map"
  | "key-powerup"
  | "trap1"
  | "trap2"
  | "trap3";

export type Position = { x: number; y: number };

function isPathReachable(maze: MazeCell[][], start: Position, end: Position): boolean {
  const queue: Position[] = [start];
  const visited = new Set<string>();
  const width = maze[0].length;
  const height = maze.length;

  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    if (x === end.x && y === end.y) return true;

    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < width &&
        newY < height &&
        !visited.has(key) &&
        (maze[newY][newX] === "path" || maze[newY][newX] === "door" || maze[newY][newX] === "exit")
      ) {
        visited.add(key);
        queue.push({ x: newX, y: newY });
      }
    });
  }
  return false;
}

export function generateMaze(width: number, height: number): MazeCell[][] {
  const maze: MazeCell[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill("path") as MazeCell[]);

  for (let x = 0; x < width; x++) {
    maze[0][x] = "wall";
    maze[height - 1][x] = "wall";
  }
  for (let y = 0; y < height; y++) {
    maze[y][0] = "wall";
    maze[y][width - 1] = "wall";
  }

  const startY = Math.floor(Math.random() * (height - 2)) + 1;
  maze[startY][0] = "start";
  maze[startY][1] = "path";

  const exitY = Math.floor(Math.random() * (height - 2)) + 1;
  maze[exitY][width - 1] = "exit";
  maze[exitY][width - 2] = "path";

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if ((x === 1 && y === startY) || (x === width - 2 && y === exitY)) continue;
      if (Math.random() < 0.35) {
        maze[y][x] = "wall";
      }
    }
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (maze[y][x] === "path") {
        let wallCount = 0;
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dx, dy]) => {
          if (maze[y + dy]?.[x + dx] === "wall") wallCount++;
        });

        if (wallCount >= 1 && Math.random() < 0.3) {
          maze[y][x] = "door";
        }
      }
    }
  }

  let pathExists = isPathReachable(maze, { x: 1, y: startY }, { x: width - 2, y: exitY });
  while (!pathExists) {
    let x = width - 2;
    let y = exitY;

    while (x > 1) {
      maze[y][x] = Math.random() < 0.2 ? "door" : "path";
      if (y > startY && Math.random() < 0.3) y--;
      if (y < startY && Math.random() < 0.3) y++;
      x--;
    }

    pathExists = isPathReachable(maze, { x: 1, y: startY }, { x: width - 2, y: exitY });
  }

  return maze;
}

export function generateLevel2Maze(
  width: number,
  height: number,
  gamesPlayed = 0,
  isCasualMode = false
): MazeCell[][] {
  const maze = generateMaze(width, height);

  let startPos = { x: 0, y: 0 };
  let exitPos = { x: 0, y: 0 };

  for (let y = 0; y < height; y++) {
    if (y === 0 || y === height - 1) {
      for (let x = 1; x < width - 1; x++) {
        maze[y][x] = "path";
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x] === "start") {
        startPos = { x, y };
      } else if (maze[y][x] === "exit") {
        exitPos = { x, y };
      }
    }
  }

  if (isCasualMode) {
    return maze;
  }

  let fakeExitPlaced = false;
  let attempts = 0;
  const maxAttempts = 50;

  if (gamesPlayed >= 3) {
    while (!fakeExitPlaced && attempts < maxAttempts) {
      const y = Math.floor(Math.random() * (height - 2)) + 1;
      if (y !== exitPos.y && maze[y][width - 1] === "wall") {
        if (maze[y][width - 2] === "path") {
          maze[y][width - 1] = "fake-exit";
          fakeExitPlaced = true;
        }
      }
      attempts++;
    }
  }

  if (gamesPlayed >= 10) {
    let secondFakeExitPlaced = false;
    attempts = 0;

    while (!secondFakeExitPlaced && attempts < maxAttempts) {
      const y = Math.floor(Math.random() * (height - 2)) + 1;
      if (y !== exitPos.y && maze[y][width - 1] === "wall" && maze[y][width - 1] !== "fake-exit") {
        if (maze[y][width - 2] === "path") {
          maze[y][width - 1] = "fake-exit";
          secondFakeExitPlaced = true;
        }
      }
      attempts++;
    }
  }

  if (gamesPlayed >= 3) {
    let crystalBallPlaced = false;
    while (!crystalBallPlaced) {
      const x = Math.floor(Math.random() * (width - 2)) + 1;
      const y = Math.floor(Math.random() * (height - 2)) + 1;

      if (maze[y][x] === "path" && !(x === startPos.x && y === startPos.y) && !(x === exitPos.x && y === exitPos.y)) {
        if (isPathReachable(maze, startPos, { x, y })) {
          maze[y][x] = "crystal-ball";
          crystalBallPlaced = true;
        }
      }
    }
  }

  let mapPlaced = false;
  while (!mapPlaced) {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;

    if (maze[y][x] === "path" && !(x === startPos.x && y === startPos.y) && !(x === exitPos.x && y === exitPos.y)) {
      if (isPathReachable(maze, startPos, { x, y })) {
        maze[y][x] = "map";
        mapPlaced = true;
      }
    }
  }

  const placeKeyPowerup = (m: MazeCell[][], sp: Position, ep: Position) => {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * (width - 2)) + 1;
      const y = Math.floor(Math.random() * (height - 2)) + 1;

      if (m[y][x] === "path" && !(x === sp.x && y === sp.y) && !(x === ep.x && y === ep.y)) {
        if (isPathReachable(m, sp, { x, y })) {
          m[y][x] = "key-powerup";
          placed = true;
        }
      }
    }
  };

  let numKeyPowerups: number;
  if (gamesPlayed < 10) {
    numKeyPowerups = Math.random() < 0.7 ? 2 : 3;
  } else {
    numKeyPowerups = Math.random() < 0.7 ? 3 : 4;
  }

  for (let i = 0; i < numKeyPowerups; i++) {
    placeKeyPowerup(maze, startPos, exitPos);
  }

  let trapFrequency = 0;
  if (gamesPlayed >= 20) {
    trapFrequency = 0.18;
  } else if (gamesPlayed >= 10) {
    trapFrequency = 0.12;
  } else if (gamesPlayed >= 3) {
    trapFrequency = 0.05;
  }

  if (gamesPlayed >= 3) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (maze[y][x] === "path") {
          const isNearStart = x <= 2;
          const isNearExit = x === width - 2 && y === exitPos.y;
          const hasAdjacentDoor = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(
            ([dx, dy]) => maze[y + dy]?.[x + dx] === "door"
          );

          if (!isNearStart && !isNearExit && !hasAdjacentDoor && Math.random() < trapFrequency) {
            const trapType = Math.floor(Math.random() * 3) + 1;
            maze[y][x] = `trap${trapType}` as MazeCell;
          }
        }
      }
    }
  }

  return maze;
}
