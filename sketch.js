var sprite_json;

// Array of background images
var bg_img = [];
// Song
var song;
// Text bar
var text_bar;
var currentCharacter = 0;

var TenderBud;
var flock = [];
var animations = {};
var num_boids = 8;

// Slider for number of boids
var boidSlider;

// Snowman
var num_snowmen = 3;
var snow_people = [];
// Snowflake
var num_snowflakes = 1000;
var snowflakes = [];

// Input fields for maxForce and maxSpeed
var maxForceInput;
var maxSpeedInput;

function preload(){
  bg_img = loadImage("/images/snow-bg.jpg");
  sprite_json = loadJSON("/Penguins/animationData.json");
  song = loadSound('./music/juna.mp3');
}

function setup() {
  frameRate(23);
  let x = windowWidth / 2;
  let y = windowHeight / 2;

  createCanvas(windowWidth, windowHeight);
  loadAnimations();
  text_bar = new textBar();
  TenderBud = new Sprite(sprite_json, x, y, "TenderBud");

  // Create the slider for number of boids
  boidSlider = createSlider(1, 100, num_boids, 1);
  boidSlider.position(10, 10);

  // Create text inputs for maxForce and maxSpeed
  maxForceInput = createInput('0.2'); // Default value for maxForce
  maxForceInput.position(10, 40);
  maxForceInput.size(50);

  maxSpeedInput = createInput('5'); // Default value for maxSpeed
  maxSpeedInput.position(10, 70);
  maxSpeedInput.size(50);

  // Initial flock setup
  for (let i = 0; i < num_boids; i++) {
    flock.push(new Boid(sprite_json, random(0, windowWidth), random(0, windowHeight), "TenderBud"));
  }

  // Snowmen
  for (let i = 0; i < num_snowmen; i++) {
    let x = random(0, windowWidth);
    let y;
    let roll = random(0, 1);
    if (roll < 0.25) {
      y = random(0, windowHeight * 0.25);
    } else if (roll < 0.5) {
      y = random(windowHeight * 0.25, windowHeight * 0.5);
    } else if (roll < 0.75) {
      y = random(windowHeight * 0.5, windowHeight * 0.75);
    } else {
      y = random(windowHeight * 0.75, windowHeight);
    }
    snow_people.push(new SnowMan(x, y));
  }

  // Snowflakes
  for (let i = 0; i < num_snowflakes; i++) {
    let x = random(0, windowWidth);
    let y = random(-windowHeight, windowHeight);
    let r = random(3, 6);
    snowflakes[i] = new Snowflake(x, y, r);
  }
}

function draw() {
  background(bg_img);

  // Update the number of boids based on the slider value
  num_boids = boidSlider.value();
  adjustFlockSize();

  // Update boid maxForce and maxSpeed from the input fields
  let maxForce = parseFloat(maxForceInput.value());
  let maxSpeed = parseFloat(maxSpeedInput.value());

  // Apply maxForce and maxSpeed to each boid
  for (let boid of flock) {
    boid.maxForce = maxForce;
    boid.maxSpeed = maxSpeed;
  }

  TenderBud.show();

  // Boid time
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  for (let snowman of snow_people) {
    snowman.show();
  }
  for (let snowflake of snowflakes) {
    snowflake.show();
    snowflake.fall();
  }

  // Display the number of boids below the slider
  fill(0);
  textSize(16);
  text(`Boids: ${num_boids}`, boidSlider.x * 2 + boidSlider.width, 25);

  // Display the current maxForce and maxSpeed values
  textSize(12);
  text(`Max Force: ${maxForce}`, maxForceInput.x + maxForceInput.width + 10, 55);
  text(`Max Speed: ${maxSpeed}`, maxSpeedInput.x + maxSpeedInput.width + 10, 85);
}

// Function to adjust the flock size based on the slider value
function adjustFlockSize() {
  if (flock.length < num_boids) {
    let newBoids = num_boids - flock.length;
    for (let i = 0; i < newBoids; i++) {
      flock.push(new Boid(sprite_json, random(0, windowWidth), random(0, windowHeight), "TenderBud"));
    }
  } else if (flock.length > num_boids) {
    flock.splice(num_boids, flock.length - num_boids);
  }
}

function loadAnimations() {
  for (let character in sprite_json) {
    animations[character] = {};
    for (let animationName in sprite_json[character]) {
      animations[character][animationName] = [];
      sprite_json[character][animationName].forEach((frameData, index) => {
        let imgPath = `/Penguins/${character}/${animationName}/${index}.png`;
        let img = loadImage(imgPath);
        animations[character][animationName].push(img);
      });
    }
  }
}

function resetCurrentCharacter() {
  currentCharacter = 0;
}

function mousePressed() {
  song.pause();
  TenderBud.moveTowards(mouseX, mouseY);
  song.play();
}

function keyPressed() {
  song.pause();
  if (keyIsDown(UP_ARROW)) {
    TenderBud.changeAction('walk_N');
    TenderBud.move(0, -TenderBud.speed * 10);
  } else if (keyIsDown(DOWN_ARROW)) {
    TenderBud.changeAction('walk_S');
    TenderBud.move(0, TenderBud.speed * 10);
  } else if (keyIsDown(LEFT_ARROW)) {
    TenderBud.changeAction('walk_W');
    TenderBud.move(-TenderBud.speed * 10, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    TenderBud.changeAction('walk_E');
    TenderBud.move(TenderBud.speed * 10, 0);
  }
  song.play();
}

function keyReleased() {
  if (
    key === 'w' || keyCode === UP_ARROW ||
    key === 's' || keyCode === DOWN_ARROW ||
    key === 'a' || keyCode === LEFT_ARROW ||
    key === 'd' || keyCode === RIGHT_ARROW
  ) {
    TenderBud.changeAction('idle');
  }
}
