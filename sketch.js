//json
var sprite_json
var x = 0;
var y = 0;
//imgs
var bg_img;
//song
var song;
//text bar
var text_bar;
var currentCharacter = 0;
var TenderBud;
var TenderBod;
var flock = [];
//preload json and image
var animations = {}
var numBoids = 4;

function preload(){
  bg_img = loadImage("/images/snow-bg.jpg")
  sprite_json = loadJSON("/Penguins/animationData.json")
  song = loadSound('./music/juna.mp3');
}

function setup() {
  frameRate(30);
  x = windowWidth/2;
  y = windowHeight /2

  createCanvas(windowWidth, windowHeight );
  loadAnimations()
  text_bar = new textBar();
  TenderBud = new Sprite( sprite_json , x , y , "TenderBud" )
  for(let i = 0; i < numBoids; i++){
    flock.push( new Boid( sprite_json ,random(0,windowWidth) , random(0,windowHeight) , "TenderBud"))
  }

}

function draw() {

  background(bg_img); 
  TenderBud.show()
  

  //BOID TIME
  for (let boid of flock) {
    boid.edges(); 
    boid.flock(flock); 
    boid.update();         
    boid.show();      
  }
  // text bar
  text_bar.show()
  //  write the current animation in the text bar
  text_bar.animateText(TenderBud.cur_action);
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
