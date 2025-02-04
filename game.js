// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the sprites 
const characterIdle = new Image();
const characterWalk = new Image();
const characterAttack = new Image();
const characterDeath = new Image();
const characterHurt = new Image();
const characterFishing = new Image();
const characterRow = new Image();
const characterHook = new Image();
const Boat = new Image();
const FishingDock = new Image();


// Set the source for the images
characterIdle.src = './assets/pixel_art/1 Fisherman/Fisherman_idle.png';
characterWalk.src = './assets/pixel_art/1 Fisherman/Fisherman_walk.png';
characterAttack.src = './assets/pixel_art/1 Fisherman/Fisherman_attack.png';
characterDeath.src = './assets/pixel_art/1 Fisherman/Fisherman_death.png';
characterHurt.src = './assets/pixel_art/1 Fisherman/Fisherman_hurt.png';
characterFishing.src = './assets/pixel_art/1 Fisherman/Fisherman_fish.png';
characterRow.src = './assets/pixel_art/1 Fisherman/Fisherman_row.png';
characterHook.src = './assets/pixel_art/1 Fisherman/Fisherman_hook.png';
Boat.src = './assets/pixel_art/3 Objects/Boat.png';
FishingDock.src = './assets/pixel_art/3 Objects/Fishing_hut.png';

// Start the game loop once all images are loaded
let imagesLoaded = 0;
const totalImages = 10;
function checkImagesLoaded() {
  imagesLoaded++;
  console.log(`Images loaded: ${imagesLoaded}/${totalImages}`);
  if (imagesLoaded === totalImages) {
    gameLoop(); 
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
characterHook.onload = checkImagesLoaded;
Boat.onload = checkImagesLoaded;
FishingDock.onload = checkImagesLoaded;

// Keyboard input tracking
let keys = {};
document.addEventListener('keydown', (event) => { keys[event.key] = true; });
document.addEventListener('keyup', (event) => { keys[event.key] = false; });

// Game state variables
let isOnBoat = false;
let isFishing = false; 
let isRowing = false;
let characterAction = 'idle';
let characterMovementLocked = false; 
let characterFacingDirection = 1; 

// Frame variables for animations
let currentFrame = 0;
let frameSpeed = 14; 
let frameCounter = 0;

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

// Boat definition
let boat = {
  x: 30,
  y: canvas.height / 1.1,
  width: 100,
  height: 50,
  image: Boat,
};

// Dock definition
let dock = {
  x: canvas.width - 185,
  y: canvas.height / 1.2,
  width: 150*1.2,
  height: 100*1.2,
  image: FishingDock,
};

// flag to prevent continuous toggling of fishing state
let fishingKeyPressed = false; 

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
  switch(action) {
    case 'attack':
      return 6;
    case 'fishing':
      return 4;
    case 'death':
      return 6;
    case 'walk':
      return 6; 
    case 'hurt':
      return 2; 
    case 'row':
      return 4;
    case 'idle':
      return 4; 
    default:
      return 4; 
  }
}

// Function to move the character or boat
function moveCharacter() {
  if (isFishing || characterMovementLocked) {
    return; 
  }

  if (isOnBoat) {
    // Rowing boat logic
    if (keys['w']) { boat.y -= boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['s']) { boat.y += boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['a']) { boat.x -= boat.speed; isRowing = true; characterAction = 'row'; }
    if (keys['d']) { boat.x += boat.speed; isRowing = true; characterAction = 'row'; }
    if (!keys['w'] && !keys['s'] && !keys['a'] && !keys['d']) { isRowing = false; characterAction = 'idle'; }
  } else {
    // Walking character logic
    if (keys['w']) { character.y -= character.speed; characterAction = 'walk'; }
    if (keys['s']) { character.y += character.speed; characterAction = 'walk'; }
    if (keys['a']) { 
      character.x -= character.speed; 
      characterAction = 'walk'; 
      characterFacingDirection = -1; 
    }
    if (keys['d']) { 
      character.x += character.speed; 
      characterAction = 'walk'; 
      characterFacingDirection = 1; 
    }
    if (!keys['w'] && !keys['s'] && !keys['a'] && !keys['d']) { characterAction = 'idle'; }
  }
}

// Function to toggle fishing action when pressing 'f'
function toggleFishing() {
  if (keys['f'] && !fishingKeyPressed) {
    fishingKeyPressed = true;  

    // Toggle the fishing state
    isFishing = !isFishing;
    characterMovementLocked = isFishing;  
    characterAction = isFishing ? 'fishing' : 'idle'; 
  }
}

// Reset the flag when the 'f' key is released
document.addEventListener('keyup', (event) => {
  if (event.key === 'f') {
    fishingKeyPressed = false; 
  }
});

// Function to check if the character is near the boat to climb
function checkClimbBoat() {
  if (!isOnBoat && character.x < boat.x + boat.width && character.x + character.width > boat.x &&
      character.y < boat.y + boat.height && character.y + character.height > boat.y) {
    if (keys['e']) {
      isOnBoat = true;
      character.x = boat.x;
      character.y = boat.y;
      characterAction = 'row';
    }
  } else if (isOnBoat && keys['e']) {
    isOnBoat = false;
    character.x = boat.x + boat.width / 2;
    character.y = boat.y + boat.height / 2;
    characterAction = 'idle';
  }
}

// Function to get the correct character image based on the action
function getCharacterImage(action) {
  switch (action) {
    case 'idle':
      return characterIdle;
    case 'walk':
      return characterWalk;
    case 'attack':
      return characterAttack;
    case 'death':
      return characterDeath;
    case 'hurt':
      return characterHurt;
    case 'fishing':
      return characterFishing;
    case 'row':
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
  ctx.drawImage(getCharacterImage(characterAction), currentFrameX, 0, frameWidth, frameHeight, drawX * (scaleX === -1 ? -1 : 1), character.y, character.width, character.height);
  ctx.restore(); 
}

// Function to draw objects
function drawObjects() {
  ctx.drawImage(boat.image, boat.x, boat.y, boat.width, boat.height);
  ctx.drawImage(dock.image, dock.x, dock.y, dock.width, dock.height);
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
  toggleFishing();  
  updateFrame();  
  drawObjects();
  drawCharacter(); 
  requestAnimationFrame(gameLoop);
}
