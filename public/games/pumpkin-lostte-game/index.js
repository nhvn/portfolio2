// BACKGROUND
const background = (document.querySelector(".myImg").src = "./img/4_game_background.png");
const platform = (document.querySelector(".myImg").src = "./img/platform.png");
const spider = (document.querySelector(".myImg").src = "./img/Spider2.png");
const boo = (document.querySelector(".myImg").src = "./img/BooSign.png");
const pumpkin = (document.querySelector(".myImg").src = "./img/Pumpkin3.png");
const findpumpkin = (document.querySelector(".myImg").src = "./img/findpumpkin.png");
const sparkle = (document.querySelector(".myImg").src = "./img/sparkle.png");
const canvas = document.querySelector("canvas");
const chaser = (document.querySelector(".myImg").src = "./img/chaser.jpg");
const modal = document.getElementById("modal");
const retryButton = document.getElementById("retry-button");
const winModal = document.getElementById("win-modal");
const winButton = document.getElementById("win-button");
const winTimeEl = document.getElementById("win-time");
const irisMask = document.getElementById("iris-mask");
const winPumpkin = document.getElementById("win-pumpkin");
const gameWrapEl = document.getElementById("game-wrap");
const bgMusic = document.getElementById("bg-music");

bgMusic.volume = 0.1;

// MUSIC
const playButton = document.createElement("button");
playButton.id = "play-button";
playButton.textContent = "♪";
canvas.parentElement.appendChild(playButton);

playButton.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    playButton.style.opacity = "1";
  } else {
    bgMusic.pause();
    playButton.style.opacity = "0.4";
  }
});
playButton.style.opacity = "0.4";

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 1000;

modal.style.display = "none";
winModal.style.display = "none";

// SPRITE
const spriteStandRight = (document.querySelector(".myImg").src = "./img/idleRight.png");
const spriteRunRight = (document.querySelector(".myImg").src = "./img/walkRight.png");
const spriteRunLeft = (document.querySelector(".myImg").src = "./img/walkLeft.png");
const spriteStandLeft = (document.querySelector(".myImg").src = "./img/idleLeft.png");

const GRAVITY = 0.34; // per normalized frame (dt = 1 at 60fps)
const JUMP_VELOCITY = -8;
const GROUND_Y = 520;

// Spawn/dead-zone are relative to the actual canvas width instead of fixed
// pixels — a fixed spawn (e.g. x:800) put the player off-screen entirely on
// a narrower embed like ours, which read as "the game isn't centered."
const SPAWN_X = Math.round(canvas.width * 0.28);
const DEADZONE_RIGHT = Math.round(canvas.width * 0.45);
const DEADZONE_LEFT = Math.round(canvas.width * 0.12);

// PROPERTIES OF CHARACTER
class Player {
  constructor() {
    this.speed = 3;
    this.position = {
      x: SPAWN_X,
      y: GROUND_Y - 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 36;
    this.height = 50;
    this.grounded = false;
    this.frames = 0;
    this.frameDelay = 12; // in normalized frames
    this.frameDelayCount = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
      },
    };
    this.currentSprite = this.sprites.stand.right;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      32 * this.frames,
      0,
      32,
      32,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(dt) {
    this.frameDelayCount += dt;
    if (this.frameDelayCount >= this.frameDelay) {
      this.frameDelayCount = 0;
      this.frames++;
    }

    if (this.frames > 1 && this.currentSprite === this.sprites.stand.right) this.frames = 0;
    else if (this.frames > 4 && this.currentSprite === this.sprites.run.right) this.frames = 0;
    else if (this.frames > 1 && this.currentSprite === this.sprites.stand.left) this.frames = 0;
    else if (this.frames > 4 && this.currentSprite === this.sprites.run.left) this.frames = 0;

    this.draw();
    this.position.y += this.velocity.y * dt;
    this.position.x += this.velocity.x * dt;
    if (this.position.y + this.height + this.velocity.y * dt <= canvas.height) {
      this.velocity.y += GRAVITY * dt;
    }
  }
}

// PLATFORM & GENERAL OBJECT
class Platform {
  constructor({ x, y, image, width }) {
    this.position = { x, y };
    this.image = image;
    this.width = width || image.width;
    this.height = image.height;
  }
  draw() {
    c.filter = "drop-shadow(0px 0px 40px rgba(0, 0, 0, 1))";
    // Tile the sprite at its native width instead of stretching it to fit —
    // stretching a 125px-wide texture out to 250px squashed/smeared it
    // horizontally. Tiling keeps every platform, narrow or wide, made of
    // the same undistorted texture.
    const nativeW = this.image.width;
    const nativeH = this.image.height;
    let drawn = 0;
    while (drawn < this.width) {
      const sliceW = Math.min(nativeW, this.width - drawn);
      c.drawImage(this.image, 0, 0, sliceW, nativeH, this.position.x + drawn, this.position.y, sliceW, nativeH);
      drawn += sliceW;
    }
    c.filter = "none";
  }
}

// A hazard that sits on top of a platform — touching it (rather than
// jumping over it) ends the run. Drawn procedurally since the original
// asset set has no dedicated obstacle sprite.
class Spike {
  constructor({ x, y }) {
    this.drawWidth = 22;
    this.drawHeight = 16;
    this.position = { x, y: y - this.drawHeight };
    // The collision box is deliberately smaller than the drawn triangle and
    // sits low, near its base — a jump that's already rising by the time it
    // crosses the spike's x-range shouldn't graze a hitbox that matches the
    // pointed tip, or a near-miss reads as unfair rather than a real touch.
    this.width = 10;
    this.height = 5;
    this.hitboxOffsetX = (this.drawWidth - this.width) / 2;
    this.hitboxOffsetY = this.drawHeight - this.height;
  }
  get hitbox() {
    return { x: this.position.x + this.hitboxOffsetX, y: this.position.y + this.hitboxOffsetY };
  }
  draw() {
    c.fillStyle = "#e8352b";
    c.strokeStyle = "#5a0f0f";
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(this.position.x, this.position.y + this.drawHeight);
    c.lineTo(this.position.x + this.drawWidth / 2, this.position.y);
    c.lineTo(this.position.x + this.drawWidth, this.position.y + this.drawHeight);
    c.closePath();
    c.fill();
    c.stroke();
  }
}

class GenericObject {
  constructor({ x, y, image, width, height }) {
    this.position = { x, y };
    this.image = image;
    this.width = width || image.width;
    this.height = height || image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

// Images used for collision-box sizing (Platform, GenericObject, and
// MovingObject all read `image.width` immediately) must already be loaded,
// or `.width` reads as 0 and every collision box silently collapses to
// nothing. Preload everything up front and hand out the loaded instances.
const imageCache = {};

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(image); // don't block the whole game on one bad asset
    image.src = src;
    imageCache[src] = image;
  });
}

function preloadAll(sources) {
  return Promise.all(sources.map(preloadImage));
}

function createImage(imageSrc) {
  return imageCache[imageSrc] || new Image();
}

let platformImage = createImage(platform);
let player = new Player();
let platforms = [];
let spikes = [];
let genericObjects = [];
let pumpkinObject = null;

const keys = {
  right: { pressed: false },
  left: { pressed: false },
};

let scrollOffset = 0;
let movingObject;
let gameStartTime = 0;
let winSequenceStarted = false;
let loseSequenceStarted = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Mario-style layout: platform width and the gap after it vary per step
// (narrow + tight gap = precision landing, wide = a breather), and every
// few steps drops a spike hazard mid-platform that has to be hopped over
// rather than just walked past. Heights are relative to the platform
// before them, clamped so the run of jumps stays within what the jump arc
// can actually clear.
const LEVEL_SPEC = [
  { width: 150, dy: 0, gap: 25 }, // spawn platform — first obstacle is just a gap, no spike yet
  { width: 110, dy: -10, gap: 24 },
  { width: 110, dy: 16, gap: 22 },
  { width: 220, dy: -22, gap: 22 }, // recovery — a breather before the first spike
  { width: 230, dy: 10, gap: 25, spike: true },
  { width: 110, dy: -16, gap: 22 },
  { width: 230, dy: 14, gap: 22 }, // recovery
  { width: 230, dy: -14, gap: 24, spike: true },
  { width: 110, dy: 16, gap: 22 },
  { width: 190, dy: -10, gap: 22 },
  { width: 230, dy: 10, gap: 25, spike: true },
  { width: 120, dy: -14, gap: 22 },
  { width: 230, dy: 12, gap: 22 }, // recovery
  { width: 110, dy: -18, gap: 24, spike: true },
  { width: 120, dy: 20, gap: 22 },
  { width: 190, dy: -12, gap: 22 },
  { width: 230, dy: 12, gap: 25, spike: true },
  { width: 110, dy: -16, gap: 22 },
  { width: 230, dy: 16, gap: 22 }, // recovery
  { width: 110, dy: -20, gap: 24, spike: true },
  { width: 120, dy: 18, gap: 22 },
  { width: 190, dy: -12, gap: 22 },
  { width: 230, dy: 12, gap: 25, spike: true },
  { width: 110, dy: -16, gap: 22 },
  { width: 230, dy: 16, gap: 22 }, // recovery — last breather before the run to the finish
  { width: 120, dy: -18, gap: 24, spike: true },
  { width: 300, dy: 10, gap: 0 }, // final platform, giant pumpkin sits here
];

function buildLevel() {
  let cursorX = SPAWN_X;
  let cursorY = GROUND_Y;
  const newPlatforms = [];
  const newSpikes = [];

  LEVEL_SPEC.forEach((spec, i) => {
    if (i > 0) cursorY = clamp(cursorY + spec.dy, GROUND_Y - 170, GROUND_Y + 40);
    const plat = new Platform({ x: cursorX, y: cursorY, image: platformImage, width: spec.width });
    newPlatforms.push(plat);
    if (spec.spike) {
      // Sit well past the platform's left edge — once the player is
      // scroll-pinned, a spike too close to where landing happens would
      // overlap the instant they touch down, with zero reaction time.
      newSpikes.push(new Spike({ x: cursorX + spec.width * 0.45 - 11, y: cursorY }));
    }
    cursorX += spec.width + spec.gap;
  });

  return { platforms: newPlatforms, spikes: newSpikes, lastPlatform: newPlatforms[newPlatforms.length - 1] };
}

function init() {
  platformImage = createImage(platform);
  player = new Player();

  const level = buildLevel();
  platforms = level.platforms;
  spikes = level.spikes;
  const last = level.lastPlatform;

  // Drawn much bigger than its native art (21x22) so it reads unmistakably
  // as the finish line, not just another piece of scenery. Sits on top of
  // the last (extra-wide) platform.
  const FINISH_SIZE = 130;
  pumpkinObject = new GenericObject({
    x: last.position.x + last.width / 2 - FINISH_SIZE / 2,
    y: last.position.y - FINISH_SIZE,
    image: createImage(pumpkin),
    width: FINISH_SIZE,
    height: FINISH_SIZE,
  });

  genericObjects = [
    new GenericObject({ x: SPAWN_X - 300, y: 0, image: createImage(background) }),
    new GenericObject({ x: SPAWN_X + 1600, y: 0, image: createImage(background) }),
    new GenericObject({ x: SPAWN_X - 120, y: 100, image: createImage(spider) }),
    new GenericObject({ x: SPAWN_X - 80, y: 300, image: createImage(findpumpkin) }),
    new GenericObject({ x: SPAWN_X + 600, y: 245, image: createImage(boo) }),
    new GenericObject({ x: SPAWN_X + 1500, y: 220, image: createImage(boo) }),
    new GenericObject({ x: SPAWN_X + 2100, y: 180, image: createImage(sparkle) }),
    pumpkinObject,
  ];

  movingObject = new MovingObject({
    x: -1000,
    y: 0,
    image: createImage(chaser),
    speed: 3.1, // still faster than the player's own 3, just a little less brutal than before
  });

  scrollOffset = 0;
  keys.right.pressed = false;
  keys.left.pressed = false;
  gameStartTime = performance.now();
  winSequenceStarted = false;
  loseSequenceStarted = false;
  if (irisMask) irisMask.classList.remove("active");
  if (winPumpkin) winPumpkin.classList.remove("show", "shrink");
  if (gameWrapEl) gameWrapEl.classList.remove("shake");
}

// CHASER
class MovingObject {
  constructor({ x, y, image, speed }) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = canvas.height;
    this.speed = speed;
  }

  draw() {
    c.filter = "drop-shadow(0px 0px 50px rgba(0, 0, 0, 0.8))";
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    c.filter = "none";
  }

  update(dt) {
    this.position.x += this.speed * dt;
  }
}

function checkOverlap(a, aw, ah, b, bw, bh) {
  return a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;
}

function formatTime(ms) {
  const totalSeconds = ms / 1000;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds - mins * 60;
  return mins > 0 ? `${mins}:${secs.toFixed(1).padStart(4, "0")}` : `${secs.toFixed(1)}s`;
}

// Touching the pumpkin freezes the run immediately, then plays an iris
// wipe that closes in on the pumpkin's on-screen position before the win
// modal (with the run's time) appears.
function triggerWin() {
  if (winSequenceStarted) return;
  winSequenceStarted = true;

  const elapsed = performance.now() - gameStartTime;
  const px = ((pumpkinObject.position.x + pumpkinObject.width / 2) / canvas.width) * 100;
  const py = ((pumpkinObject.position.y + pumpkinObject.height / 2) / canvas.height) * 100;

  // 1) Iris closes in on the pumpkin's exact on-screen spot — a shrinking
  // circular window onto the game, solid black outside it.
  if (irisMask) {
    irisMask.style.setProperty("--wx", `${px}%`);
    irisMask.style.setProperty("--wy", `${py}%`);
    irisMask.classList.add("active");
  }

  // 2) Once the iris has fully closed, reveal a standalone pumpkin on the
  // black screen, let it sit for a beat, then shrink it down...
  setTimeout(() => {
    if (winPumpkin) winPumpkin.classList.add("show");
  }, 900);

  setTimeout(() => {
    if (winPumpkin) winPumpkin.classList.add("shrink");
  }, 1450);

  // 3) ...and only then show the win card with the run's time.
  setTimeout(() => {
    if (winTimeEl) winTimeEl.textContent = `You made it in ${formatTime(elapsed)}!`;
    winModal.style.display = "block";
    const content = winModal.querySelector(".modal-content");
    if (content) {
      content.classList.remove("pop-in");
      void content.offsetWidth; // restart the animation on repeat wins
      content.classList.add("pop-in");
    }
  }, 2000);
}

// Hitting a hazard freezes the run, plays a quick arcade-style flash/shake
// on the game view, then brings up the retry prompt.
function triggerLose() {
  if (loseSequenceStarted) return;
  loseSequenceStarted = true;

  if (gameWrapEl) gameWrapEl.classList.add("shake");

  setTimeout(() => {
    if (gameWrapEl) gameWrapEl.classList.remove("shake");
    modal.style.display = "block";
    const content = modal.querySelector(".modal-content");
    if (content) {
      content.classList.remove("pop-in");
      void content.offsetWidth;
      content.classList.add("pop-in");
    }
  }, 450);
}

// ANIMATION
let lastTimestamp = null;

function animate(timestamp) {
  if (
    modal.style.display === "block" ||
    winModal.style.display === "block" ||
    winSequenceStarted ||
    loseSequenceStarted
  ) {
    lastTimestamp = null;
    return;
  }
  requestAnimationFrame(animate);

  if (lastTimestamp === null) lastTimestamp = timestamp;
  let dt = (timestamp - lastTimestamp) / (1000 / 60);
  lastTimestamp = timestamp;
  dt = Math.min(Math.max(dt, 0), 3); // clamp so a dropped/backgrounded tab can't cause a huge jump

  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => genericObject.draw());
  platforms.forEach((platform) => platform.draw());
  spikes.forEach((spike) => spike.draw());

  player.grounded = false;
  player.update(dt);
  movingObject.update(dt);
  movingObject.draw();

  if (keys.right.pressed && player.position.x < DEADZONE_RIGHT) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > DEADZONE_LEFT) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    // The chaser (movingObject) rides along with everything else in the
    // world here — it's just another world object being scrolled past the
    // player, on top of the constant forward drift from its own update(dt)
    // above. It never reacts to the player's own left/right key state
    // directly; that was making it look like it was tethered to the
    // player's movement instead of approaching on its own.
    if (keys.right.pressed) {
      scrollOffset += player.speed * dt;
      platforms.forEach((platform) => (platform.position.x -= player.speed * dt));
      spikes.forEach((spike) => (spike.position.x -= player.speed * dt));
      movingObject.position.x -= player.speed * dt;
      pumpkinObject.position.x -= player.speed * dt; // scrolls with the platform it sits on, not the parallax background
      genericObjects.forEach((genericObject) => {
        if (genericObject !== pumpkinObject) genericObject.position.x -= player.speed * 0.66 * dt;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed * dt;
      platforms.forEach((platform) => (platform.position.x += player.speed * dt));
      spikes.forEach((spike) => (spike.position.x += player.speed * dt));
      movingObject.position.x += player.speed * dt;
      pumpkinObject.position.x += player.speed * dt;
      genericObjects.forEach((genericObject) => {
        if (genericObject !== pumpkinObject) genericObject.position.x += player.speed * 0.66 * dt;
      });
    }
  }

  // PLATFORM COLLISION DETECTION
  // One-way platforms: landing on top is the only interaction. A jump that
  // comes up just short falls straight through instead of instantly dying
  // on the side of the platform's (much taller) sprite — a miss should
  // feel like "try again," not a surprise kill.
  // This has to stay smaller than the level's height steps (10-22px) —
  // it used to be 24px, bigger than every one of those steps, which meant
  // simply walking off an edge (no jump at all) was "close enough" to snap
  // onto the next platform regardless of how much higher it was.
  const LANDING_TOLERANCE = 8;
  platforms.forEach((platform) => {
    const withinX =
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width;
    const footY = player.position.y + player.height;

    if (
      withinX &&
      player.velocity.y >= 0 &&
      footY <= platform.position.y + LANDING_TOLERANCE &&
      footY + player.velocity.y * dt >= platform.position.y
    ) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
      player.grounded = true;
    }
  });

  // CHASER COLLISION DETECTION
  if (
    checkOverlap(
      player.position,
      player.width,
      player.height,
      movingObject.position,
      movingObject.width,
      movingObject.height
    )
  ) {
    triggerLose();
  }

  // SPIKE COLLISION DETECTION: touching one ends the run — has to be
  // jumped over, not walked through.
  if (
    spikes.some((spike) =>
      checkOverlap(player.position, player.width, player.height, spike.hitbox, spike.width, spike.height)
    )
  ) {
    triggerLose();
  }

  // WIN: touch the (now much bigger) pumpkin. A little padding still helps
  // since it's drawn as a plain square sprite with transparent corners.
  if (pumpkinObject) {
    const PAD = 12;
    const winBox = {
      x: pumpkinObject.position.x - PAD,
      y: pumpkinObject.position.y - PAD,
    };
    if (
      checkOverlap(
        player.position,
        player.width,
        player.height,
        winBox,
        pumpkinObject.width + PAD * 2,
        pumpkinObject.height + PAD * 2
      )
    ) {
      triggerWin();
    }
  }

  // LOSE: fall off the bottom or top of the level
  if (player.position.y > canvas.height || player.position.y < -50) {
    triggerLose();
  }
}

const loadingOverlay = document.getElementById("loading-overlay");

preloadAll([
  background,
  platform,
  spider,
  boo,
  pumpkin,
  findpumpkin,
  sparkle,
  chaser,
  spriteStandRight,
  spriteRunRight,
  spriteRunLeft,
  spriteStandLeft,
]).then(() => {
  if (loadingOverlay) loadingOverlay.style.display = "none";
  init();
  requestAnimationFrame(animate);
});

// PROMPT BUTTON
retryButton.addEventListener("click", () => {
  init();
  modal.style.display = "none";
  requestAnimationFrame(animate);
});

// WIN BUTTON
winButton.addEventListener("click", () => {
  init();
  winModal.style.display = "none";
  requestAnimationFrame(animate);
});

// CHARACTER MOVEMENT
function startRight() {
  keys.right.pressed = true;
  player.currentSprite = player.sprites.run.right;
}
function stopRight() {
  keys.right.pressed = false;
  // If the other direction is still held (a quick tap-the-opposite-way
  // while still holding the first key), keep facing that way instead of
  // snapping to this key's own "stand" pose — that mismatch is what made
  // the character flash the wrong direction while still moving.
  player.currentSprite = keys.left.pressed ? player.sprites.run.left : player.sprites.stand.right;
}
function startLeft() {
  keys.left.pressed = true;
  player.currentSprite = player.sprites.run.left;
}
function stopLeft() {
  keys.left.pressed = false;
  player.currentSprite = keys.right.pressed ? player.sprites.run.right : player.sprites.stand.left;
}
function doJump() {
  if (player.grounded) {
    player.velocity.y = JUMP_VELOCITY;
    player.grounded = false;
  }
}

addEventListener("keydown", ({ keyCode, repeat }) => {
  if (repeat) return;
  switch (keyCode) {
    case 68: // d
      startRight();
      break;
    case 65: // a
      startLeft();
      break;
    case 87: // w
      doJump();
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 68:
      stopRight();
      break;
    case 65:
      stopLeft();
      break;
    case 87:
      // cut the jump short if the key is released while still rising
      if (player.velocity.y < -3) player.velocity.y = -3;
      break;
  }
});

// TOUCH CONTROLS
function bindHold(el, onStart, onEnd) {
  if (!el) return;
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onStart();
  });
  el.addEventListener("touchend", (e) => {
    e.preventDefault();
    onEnd();
  });
  el.addEventListener("mousedown", onStart);
  el.addEventListener("mouseup", onEnd);
  el.addEventListener("mouseleave", onEnd);
}

bindHold(document.getElementById("btn-left"), startLeft, stopLeft);
bindHold(document.getElementById("btn-right"), startRight, stopRight);

const jumpBtn = document.getElementById("btn-jump");
if (jumpBtn) {
  jumpBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    doJump();
  });
  jumpBtn.addEventListener("mousedown", doJump);
}
