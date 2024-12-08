class Sprite {
  constructor(sprite_data, x, y, sprite_name) {
    this.position = createVector(x, y);
    this.sprite_name = sprite_name;
    this.animations = {};
    this.cur_frame = 0;
    this.cur_action = "idle";
    this.sprite_data = sprite_data[sprite_name];
    this.scale = .5;
    this.speed = 8;
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
    push()

    // If moving, update position

    if (this.moving && this.target) {
      this.moveToClick();
    }

    let frames = this.animations[this.cur_action];

    imageMode(CENTER);

    if (frames && frames.length > 0) {
      let currentImage = frames[this.cur_frame % frames.length];
      image(currentImage, this.position.x, this.position.y, currentImage.width * this.scale, currentImage.height * this.scale);
      this.cur_frame++;
    }
    strokeWeight(6);
    stroke(255,0,0);
    point(this.position.x, this.position.y);
    pop();

  }
  //  keypress
  move( dx, dy){
    this.position.x += dx
    this.position.y += dy
    console.log(this.position.x)
    console.log(this.position.y)
    this.position.x = constrain(this.position.x, 0, width - this.getWidth());
    this.position.y = constrain(this.position.y, 0, height - this.getHeight());
    console.log(this.position.x);
    console.log(this.position.y);
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
      let direction = createVector(this.target.x - this.position.x, this.target.y - this.position.y);
      let distance = direction.mag();

      if (distance > this.speed) {
        direction.normalize();
        // Calculate the new position
        let newX = this.position.x + direction.x * this.speed;
        let newY = this.position.y + direction.y * this.speed;
        //  check if we are in bounds
        this.position.x = constrain(newX, 0, width - this.getWidth());
        this.position.y = constrain(newY, 0, height - this.getHeight());
        // set dir
        this.updateDirection(direction);
      } else {
        // reset to idle when reaching the target
        this.position.x = constrain(this.target.x, 0, width - this.getWidth());
        this.position.y = constrain(this.target.y, 0, height - this.getHeight());
        this.moving = false;
        this.changeAction('idle');
      }
    }
  }



}
