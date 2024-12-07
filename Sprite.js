class Sprite {
  constructor(sprite_data, x, y, sprite_name) {
    this.x = x;
    this.y = y;
    this.sprite_name = sprite_name;
    this.animations = {};
    this.cur_frame = 0;
    this.cur_action = "idle";
    this.sprite_data = sprite_data[sprite_name]; 
    this.scale = .5;
    this.speed = 5;
    this.pathToAnimation = "/Penguins/" + sprite_name + "/";
    this.target = null;
    this.moving = false; 
    this.preloadImages();
  }

  // Preload images for each animation action
  preloadImages() {
    for (let action in this.sprite_data) {
      this.animations[action] = [];
      this.sprite_data[action].forEach((frameData, index) => {
        let imgPath = this.pathToAnimation + action + "/" + index + ".png";
        let img = loadImage(imgPath);
        this.animations[action].push(img);
      });
    }
  }

  // Display the current frame of the current action
  show() {
    // If moving, update position
    if (this.moving && this.target) {
      this.moveToClick();
    }
    
    let frames = this.animations[this.cur_action];
    if (frames && frames.length > 0) {
      let currentImage = frames[this.cur_frame % frames.length];
      image(currentImage, this.x, this.y, currentImage.width * this.scale, currentImage.height * this.scale);
      this.cur_frame++;
    }
  }
  //  keypress
  move( dx, dy){
    this.x += dx 
    this.y += dy 
    console.log(this.x)
    console.log(this.y)
    this.x = constrain(this.x, 0, width - this.getWidth());
    this.y = constrain(this.y, 0, height - this.getHeight());
    console.log(this.x);
    console.log(this.y);
  }
  // Update the animation based on movement direction
  updateDirection(direction) {
    if (abs(direction.x) > abs(direction.y)) {
      // Horizontal movement
      if (direction.x > 0) {
        this.changeAction('walk_E'); // Move right
      } else {
        this.changeAction('walk_W'); // Move left
      }
    } else {
      // Vertical movement
      if (direction.y > 0) {
        this.changeAction('walk_S'); // Move down
      } else {
        this.changeAction('walk_N'); // Move up
      }
    }
  }

  changeAction(next) {
    if (this.cur_action !== next) {
      this.cur_action = next;
      this.cur_frame = 0;
      resetCurrentCharacter()
      text_bar.changeText(next)
    }
  }

  // Get the current width of the sprite image
  getWidth() {
    if (this.animations[this.cur_action].length > 0) {
      let currentImage = this.animations[this.cur_action][this.cur_frame % this.animations[this.cur_action].length];
      return currentImage.width * this.scale;
    }
    return 0;
  }

  // Get the current height of the sprite image
  getHeight() {
    if (this.animations[this.cur_action].length > 0) {
      let currentImage = this.animations[this.cur_action][this.cur_frame % this.animations[this.cur_action].length];
      return currentImage.height * this.scale;
    }
    return 0;
  }
  // mouseclick
  moveTowards(x, y) {
    this.target = createVector(x, y);
    this.moving = true;
  }
  //  helper function for animating the path
  moveToClick() {
    //  thank god for physics 2
    if (this.target) {
      let direction = createVector(this.target.x - this.x, this.target.y - this.y);
      let distance = direction.mag();
      
      if (distance > this.speed) {
        direction.normalize();
        // Calculate the new position
        let newX = this.x + direction.x * this.speed;
        let newY = this.y + direction.y * this.speed;
        //  check if we are in bounds
        this.x = constrain(newX, 0, width - this.getWidth());
        this.y = constrain(newY, 0, height - this.getHeight());
        // set dir
        this.updateDirection(direction);
      } else {
        // reset to idle when reaching the target
        this.x = constrain(this.target.x, 0, width - this.getWidth());
        this.y = constrain(this.target.y, 0, height - this.getHeight());
        this.moving = false;
        this.changeAction('idle');
      }
    }
  }
  

  
}
