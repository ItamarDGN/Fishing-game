//canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function newImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// imgs source
const assetsPath = "./assets/pixel_art/";
const characterIdle = newImage(assetsPath + "/1 Fisherman/Fisherman_idle.png");
const characterWalk = newImage(assetsPath + "/1 Fisherman/Fisherman_walk.png");
const characterAttack = newImage(
  assetsPath + "/1 Fisherman/Fisherman_attack.png"
);
const characterDeath = newImage(
  assetsPath + "/1 Fisherman/Fisherman_death.png"
);
const characterHurt = newImage(assetsPath + "/1 Fisherman/Fisherman_hurt.png");
const characterFishing = newImage(
  assetsPath + "/1 Fisherman/Fisherman_fish.png"
);
const characterRow = newImage(assetsPath + "/1 Fisherman/Fisherman_row.png");
const characterHook = newImage(assetsPath + "/1 Fisherman/Fisherman_hook.png");
const Boat = newImage(assetsPath + "/3 Objects/Boat.png");
const FishingDock = newImage(assetsPath + "/3 Objects/Fishing_hut.png");
const watersheet = newImage(assetsPath + "/3 Objects/Water.png");
const piersheet = newImage(assetsPath + "/3 Objects/Pier_Tiles.png");
const grass1 = newImage(assetsPath + "/3 Objects/Grass1.png");
const grass2 = newImage(assetsPath + "/3 Objects/Grass2.png");
const grass3 = newImage(assetsPath + "/3 Objects/Grass3.png");
const grass4 = newImage(assetsPath + "/3 Objects/Grass4.png");
const fishbarrel1 = newImage(assetsPath + "/3 Objects/Fishbarrel1.png");
const fishbarrel2 = newImage(assetsPath + "/3 Objects/Fishbarrel2.png");
const fishbarrel3 = newImage(assetsPath + "/3 Objects/Fishbarrel3.png");
const fishbarrel4 = newImage(assetsPath + "/3 Objects/Fishbarrel4.png");
const fishbarrel5 = newImage(assetsPath + "/4 Icons/Icons_16.png");
const fishbarrel6 = newImage(assetsPath + "/4 Icons/Icons_19.png");
const woodbarrel = newImage(assetsPath + "/4 Icons/Icons_20.png");
const metalbarrel = newImage(assetsPath + "/4 Icons/Icons_17.png");
const boatVertical = newImage(assetsPath + "/3 Objects/Boat2.png");
const fence = newImage(assetsPath + "/3 Objects/Stay.png");

// Game state variables
let isOnBoat = false;
let isRowing = false;
let characterAction = "idle";
let characterMovementLocked = false;
let characterFacingDirection = 1;

// Frame variables for animations
let currentFrame = 0;
let frameSpeed = 14;
let frameCounter = 0;

// Map tile sizes and dimensions
const tileSize = 32;
const mapWidth = 50;
const mapHeight = 50;

// Boat definition
let boat = {
  x: 30,
  y: canvas.height / 1.2,
  width: 100,
  height: 35,
  image: Boat,
};

// Dock definition
let dock = {
  x: canvas.width - 185,
  y: canvas.height / 1.32,
  width: 150 * 1.2,
  height: 100 * 1.2,
  image: FishingDock,
};

// Character definition
let character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 48,
  height: 48,
  speed: 5,
  action: characterAction,
  image: characterIdle,
  currentFrame: 0,
};

// Camera settings
const camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

// Create random map
const map = Array.from({ length: 50 }, () =>
  Array.from({ length: 50 }, () => Math.floor(Math.random() * 3))
);

// Function to draw the map tiles
function drawMap() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileIndex = map[y][x];
      let tileImage;
      let tileX = 0;
      let tileY = 0;

      // Handle different tilesheets based on valid tile index range
      if (tileIndex >= 0 && tileIndex <= 8) {
        tileImage = watersheet;
        tileX = (tileIndex % 3) * tileSize;
        tileY = Math.floor(tileIndex / 3) * tileSize;
      }

      // Draw the tile if we have a valid tile image
      if (tileImage) {
        ctx.drawImage(
          tileImage,
          tileX,
          tileY,
          tileSize,
          tileSize,
          x * tileSize - camera.x,
          y * tileSize - camera.y,
          tileSize,
          tileSize
        );
      } else {
        console.error(`Invalid tile at position (${x}, ${y}): ${tileIndex}`);
      }
    }
  }
  for (let i = 0; i < 16; i++) {
    ctx.drawImage(
      piersheet,
      0 - camera.x,
      0 - camera.y,
      2 * tileSize,
      2 * tileSize,
      tileSize * i,
      200,
      2 * tileSize,
      2 * tileSize
    );
  }
  drawObject(boat);
  drawObject(dock);
}

function drawObject(object) {
  ctx.drawImage(
    object.image,
    object.x - camera.x,
    object.y - camera.y,
    object.width,
    object.height
  );
}

// Keyboard input tracking
let keys = {};
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
  if (event.key === "f") {
    characterMovementLocked = !characterMovementLocked;
    characterAction = characterMovementLocked ? "fishing" : "idle";
  }
});
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Function to update the current frame for animation
function updateFrame() {
  frameCounter++;
  if (frameCounter >= frameSpeed) {
    frameCounter = 0;
    currentFrame = (currentFrame + 1) % getFrameCount(characterAction);
  }
}

// Function to get the number of frames for a given action
function getFrameCount(action) {
  if (action === "hurt") {
    return 2;
  }
  if (["attack", "death", "walk"].includes(action)) {
    return 6;
  }
  return 4;
}
document.addEventListener("keydown", (event) => {
    console.log("📝 Key Pressed:", event.key); // נבדוק אם בכלל מזהה לחיצה
    keys[event.key] = true;

    if (["w", "a", "s", "d"].includes(event.key)) {
        moveCharacter();
    }
    if (event.key === "f") {
        console.log("🐟 Sending fish catch request to server...");
        gameClient.catchFish();
    }
    if (event.key === "e") {
        console.log("🛶 Trying to enter/exit boat...");
        toggleBoat();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Function to move the character or
function moveCharacter() {
  if (characterMovementLocked) {
    return;
  }

  let prevX = character.x;
  let prevY = character.y;

  if (!keys["w"] && !keys["s"] && !keys["a"] && !keys["d"]) {
    characterAction = "idle";
  } else {
    characterAction = "walk";

    if (keys["w"]) character.y -= character.speed;
    if (keys["s"]) character.y += character.speed;
    if (keys["a"]) {
      character.x -= character.speed;
      characterFacingDirection = -1;
    }
    if (keys["d"]) {
      character.x += character.speed;
      characterFacingDirection = 1;
    }
  }

  // אם השחקן באמת זז (המיקום השתנה) נשלח עדכון לשרת
  if (character.x !== prevX || character.y !== prevY) {
    gameClient.updatePlayerPosition(character.x, character.y);
  }
}

// Function to get the correct character image based on the action
function getCharacterImage(action) {
  switch (action) {
    case "idle":
      return characterIdle;
    case "walk":
      return characterWalk;
    case "attack":
      return characterAttack;
    case "death":
      return characterDeath;
    case "hurt":
      return characterHurt;
    case "fishing":
      return characterFishing;
    case "row":
      return characterRow;
    default:
      return characterIdle;
  }
}

// Function to draw the character based on action
function drawCharacter() {
  const frameWidth = 48;
  const frameHeight = 48;
  const currentFrameX = currentFrame * frameWidth;

  // Set the direction based on the horizontal movement
  let scaleX = characterFacingDirection;

  // Set the x position of the character based on the scaleX (flipping)
  let drawX = character.x;
  if (scaleX === -1) {
    drawX = character.x + character.width;
  }

  // Draw the character
  ctx.save();
  ctx.scale(scaleX, 1);
  ctx.drawImage(
    getCharacterImage(characterAction),
    currentFrameX,
    0,
    frameWidth,
    frameHeight,
    (drawX - camera.x) * (scaleX === -1 ? -1 : 1),
    character.y - camera.y,
    character.width,
    character.height
  );
  ctx.restore();
}

// Camera follow logic: Update camera position based on the character position
function updateCamera() {
  camera.x = character.x + character.width / 2 - camera.width / 2;
  camera.y = character.y + character.height / 2 - camera.height / 2;

  // Prevent the camera from going out of bounds
  camera.x = Math.max(
    0,
    Math.min(camera.x, mapWidth * tileSize - camera.width)
  );
  camera.y = Math.max(
    0,
    Math.min(camera.y, mapHeight * tileSize - camera.height)
  );
}

// The main game loop function
function gameLoop() {
  updateCamera(); // Update camera position based on the character
  drawMap();
  drawCharacter();
  moveCharacter();
  updateFrame();
  requestAnimationFrame(gameLoop);
}

gameLoop();