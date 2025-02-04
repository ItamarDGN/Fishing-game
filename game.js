// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the sprites (placeholders)
const characterIdle = new Image();
const characterWalk = new Image();
const characterAttack = new Image();
const characterDeath = new Image();
const characterHurt = new Image();
const characterFishing = new Image();
const characterRow = new Image();

// Set the source for the images (use your own sprite sheets for each action)
characterIdle.src = './assets/pixel_art/1 Fisherman/Fisherman_idle.png';
characterWalk.src = './assets/pixel_art/1 Fisherman/Fisherman_walk.png';
characterAttack.src = './assets/pixel_art/1 Fisherman/Fisherman_attack.png';
characterDeath.src = './assets/pixel_art/1 Fisherman/Fisherman_death.png';
characterHurt.src = './assets/pixel_art/1 Fisherman/Fisherman_hurt.png';
characterFishing.src = './assets/pixel_art/1 Fisherman/Fisherman_fish.png';
characterRow.src = './assets/pixel_art/1 Fisherman/Fisherman_row.png';

// Game state variables
let isOnBoat = false;
let isFishing = false;
let isRowing = false;
let characterAction = 'idle';

// Frame variables for animations
let currentFrame = 0;
let frameSpeed = 10; // Speed of animation (higher is slower)
let frameCounter = 0;

// Character definition (changed to 48x48)
let character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 48,
  height: 48,
  speed: 5,
  action: characterAction,
  image: characterIdle,
};

// Boat definition
let boat = {
  x: 100,
  y: canvas.height / 2,
  width: 100,
  height: 50,
  image: characterRow,
};

// Dock definition
let dock = {
  x: canvas.width - 200,
  y: canvas.height / 2,
  width: 150,
  height: 100,
  image: characterRow,
};

// Set up keyboard input tracking
let keys = {};
document.addEventListener('keydown', (event) => { keys[event.key] = true; });
document.addEventListener('keyup', (event) => { keys[event.key] = false; });

// Image loading and game initialization
let imagesLoaded = 0;
const totalImages = 7; // Number of images to load

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    gameLoop(); // Start the game loop once all images are loaded
  }
}

// Add onload event for each image
characterIdle.onload = checkImagesLoaded;
characterWalk.onload = checkImagesLoaded;
characterAttack.onload = checkImagesLoaded;
characterDeath.onload = checkImagesLoaded;
characterHurt.onload = checkImagesLoaded;
characterFishing.onload = checkImagesLoaded;
characterRow.onload = checkImagesLoaded;

// Function to update the current frame for animation
function updateFrame() {
  frameCounter++;
  if (frameCounter >= frameSpeed) {
    frameCounter = 0;
    currentFrame = (currentFrame + 1) % getFrameCount(characterAction); // Loop through frames for current action
  }
}

// Function to get the number of frames based on the character's action
function getFrameCount(action) {
  switch(action) {
    case 'attack':
    case 'fishing':
    case 'death':
    case 'walk':
      return 6; // 6 frames for attack, fishing, death, and walk
    case 'hurt':
      return 2; // 2 frames for hurt
    case 'row':
    case 'idle':
      return 4; // 4 frames for row and idle
    default:
      return 4; // Default to 4 frames
  }
}

// Function to move the character or boat
function moveCharacter() {
  if (isOnBoat) {
    // Rowing boat logic
    if (keys['ArrowUp']) { boat.y -= boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['ArrowDown']) { boat.y += boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['ArrowLeft']) { boat.x -= boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['ArrowRight']) { boat.x += boat.speed; isRowing = true; characterAction = 'row'; }
    if (!keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight']) { isRowing = false; characterAction = 'idle'; }
  } else {
    // Walking character logic
    if (keys['ArrowUp']) { character.y -= character.speed; characterAction = 'walk'; }
    if (keys['ArrowDown']) { character.y += character.speed; characterAction = 'walk'; }
    if (keys['ArrowLeft']) { character.x -= character.speed; characterAction = 'walk'; }
    if (keys['ArrowRight']) { character.x += character.speed; characterAction = 'walk'; }
    if (!keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight']) { characterAction = 'idle'; }
  }

  // Casting fishing line logic
  if (keys['Space'] && !isFishing) { isFishing = true; characterAction = 'fishing'; }
  if (isFishing && !keys['Space']) { isFishing = false; characterAction = 'idle'; }
}

// Function to check if the character is near the boat to climb
function checkClimbBoat() {
  if (!isOnBoat && character.x < boat.x + boat.width && character.x + character.width > boat.x &&
      character.y < boat.y + boat.height && character.y + character.height > boat.y) {
    if (keys['Enter']) {
      isOnBoat = true;
      character.x = boat.x;
      character.y = boat.y;
      characterAction = 'row';
    }
  } else if (isOnBoat && keys['Enter']) {
    isOnBoat = false;
    character.x = boat.x + boat.width / 2;
    character.y = boat.y + boat.height / 2;
    characterAction = 'idle';
  }
}

// Function to draw the character based on action
function drawCharacter() {
  let frameWidth = 48; // Each frame is 48px wide
  let frameHeight = 48; // Each frame is 48px high
  let currentFrameX = currentFrame * frameWidth; // X position of the current frame

  switch (characterAction) {
    case 'idle': 
      ctx.drawImage(characterIdle, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'walk': 
      ctx.drawImage(characterWalk, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'attack': 
      ctx.drawImage(characterAttack, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'death': 
      ctx.drawImage(characterDeath, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'hurt': 
      ctx.drawImage(characterHurt, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'fishing': 
      ctx.drawImage(characterFishing, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
    case 'row': 
      ctx.drawImage(characterRow, currentFrameX, 0, frameWidth, frameHeight, character.x, character.y, character.width, character.height); 
      break;
  }
}

// Function to draw objects (boat, dock, etc.)
function drawObjects() {
  ctx.drawImage(dock.image, dock.x, dock.y, dock.width, dock.height);
  ctx.drawImage(boat.image, boat.x, boat.y, boat.width, boat.height);
  drawCharacter(); // Draw the character with current action (idle, walk, etc.)
}

// Function to draw the ocean scene
function drawOceanScene() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#003366');
  gradient.addColorStop(1, '#3399ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// The main game loop function
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOceanScene();
  checkClimbBoat();
  moveCharacter();
  updateFrame();  // Update the frame for animations
  drawObjects();
  requestAnimationFrame(gameLoop);
}
