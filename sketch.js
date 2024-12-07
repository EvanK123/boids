//  json
var sprite_json

//  imgs
var bg_img;
//  song
var song;
//  text bar
var text_bar;
var currentCharacter = 0;


var TenderBud;
var flock = [];
var animations = {}
var num_boids = 7;

//  snowman 
var num_snowmen = 3
var snow_people = [];
//  snowflake
var num_snowflakes = 1000;
var snowflakes = [];

function preload(){
  bg_img = loadImage("/images/snow-bg.jpg")
  sprite_json = loadJSON("/Penguins/animationData.json")
  song = loadSound('./music/juna.mp3');
}

function setup() {
  frameRate(23);
  let x = windowWidth/2;
  let y = windowHeight /2

  createCanvas(windowWidth, windowHeight );
  loadAnimations()
  text_bar = new textBar();
  TenderBud = new Sprite( sprite_json , x , y , "TenderBud" )
  for(let i = 0; i < num_boids; i++){
    flock.push( new Boid( sprite_json ,random(0,windowWidth) , random(0,windowHeight) , "TenderBud"))

  }
  //  snowmen
  for(let i = 0; i < num_snowmen; i++){
    let x = random(0,windowWidth)
    let y;
    let roll = random(0,1)
    if(roll < .25){
      y = random(0,windowHeight *.25)
    }else if(roll<.5){
      y = random(windowHeight *.25,windowHeight*.5)
    }else if(roll<.75){
      y = random(windowHeight*.5,windowHeight*.75)
    }else{
      y = random(windowHeight*.75,windowHeight)
    }
    snow_people.push(new SnowMan(x,y))
  }

  //  snowflakes
  for(let i = 0; i < num_snowflakes; i++){
    let x = random(0,windowWidth) 
    let y = random(-windowHeight,windowHeight)
    let r = random(3,6)
    snowflakes[i] = new Snowflake( x , y , r );
  }

}

function draw() {

  background(bg_img); 
  TenderBud.show()
  
  //BOID TIME
  for (let boid of flock) {
    //  this is cursed they get stuck vvvvvv we should have the snow_people 
    //  like animated being crushed or something
    //  boid.checkCollisionWithSnowman(snow_people)
    boid.edges(); 
    boid.flock(flock); 
    boid.update();         
    boid.show();      
  }
  for(let snowman of snow_people){
    snowman.show()
  }
  for(let snowflake of snowflakes){
    snowflake.show()
    snowflake.fall()
  }

  
  // text bar
  //text_bar.show()
  //  write the current animation in the text bar
  //text_bar.animateText(TenderBud.cur_action);
}
function loadAnimations() {
  //  only tenderbud in this assignment
  for (let character in sprite_json) {
    animations[character] = {};
    //  the very many animations
    for (let animationName in sprite_json[character]) {
      animations[character][animationName] = [];
      sprite_json[character][animationName].forEach((frameData, index) => {
        //  /Penguins/TenderBud/{animation}/{frame}
        //  possibly more sprite for the final?? probs not tho thats so hard
        let imgPath = `/Penguins/${character}/${animationName}/${index}.png`;
        let img = loadImage(imgPath);
        animations[character][animationName].push(img);
      });
    }
  }
}

function resetCurrentCharacter(){
  //  set curr character to 0 for text bar
  currentCharacter = 0;
}
function mousePressed() {
  //  neccesary because music will only play if triggered by an event for some reason
  song.pause();
  TenderBud.moveTowards(mouseX, mouseY);
  console.log(mouseX)
  console.log(mouseY)
  //  neccesary because music will only play if triggered by an event for some reason
  song.play();
}

function keyPressed() {
  //  neccesary because music will only play if triggered by an event for some reason
  song.pause();
  //   * 10 because he moves so slow but i don't want the click move to be too fast
  if (keyIsDown(UP_ARROW)) {
    TenderBud.changeAction('walk_N'); // Change to walking north animation
    TenderBud.move(0, -TenderBud.speed * 10); 
  } else if (keyIsDown(DOWN_ARROW)) {
    TenderBud.changeAction('walk_S'); // Change to walking south animation
    TenderBud.move(0, TenderBud.speed * 10);
  } else if (keyIsDown(LEFT_ARROW)) {
    TenderBud.changeAction('walk_W'); // Change to walking west animation
    TenderBud.move(-TenderBud.speed* 10, 0); 
  } else if (keyIsDown(RIGHT_ARROW)) {
    TenderBud.changeAction('walk_E'); // Change to walking east animation
    TenderBud.move(TenderBud.speed * 10, 0); 
  }
  //  neccesary because music will only play if triggered by an event for some reason
  song.play();
}

function keyReleased() {
  // Reset to idle animation when the key is released
  if (
    key === 'w' || keyCode === UP_ARROW ||
    key === 's' || keyCode === DOWN_ARROW ||
    key === 'a' || keyCode === LEFT_ARROW ||
    key === 'd' || keyCode === RIGHT_ARROW
  ) {
    // Go back to idle when no key is pressed
    TenderBud.changeAction('idle'); 
  }
}
