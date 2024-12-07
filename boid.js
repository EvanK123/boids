class Boid {
  constructor(sprite_data, x, y, sprite_name) {
    // Basic properties
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;

    // Sprite properties
    this.sprite_data = sprite_data[sprite_name];
    this.sprite_name = sprite_name;
    this.animations = {};
    this.cur_frame = 0;
    this.cur_action = "idle";
    this.scale = 0.5;
    this.pathToAnimation = "/Penguins/" + sprite_name + "/";
    this.moving = false;
    this.width;
    this.height;

    // Preload sprite images
    this.preloadImages();
  }

  // Preload images for sprite animations
  preloadImages() {
    for (let action in this.sprite_data) {
      this.animations[action] = [];
      this.sprite_data[action].forEach((_, index) => {
        let imgPath = this.pathToAnimation + action + "/" + index + ".png";
        let img = loadImage(imgPath);
        this.animations[action].push(img);
      });
    }
  }

  // Update animation based on movement direction
  updateDirection() {
    let direction = this.velocity.copy();
    if (direction.mag() > 0) {
      if (abs(direction.x) > abs(direction.y)) {
        // Horizontal movement
        if (direction.x > 0) {
          this.changeAction("walk_E"); // Move right
        } else {
          this.changeAction("walk_W"); // Move left
        }
      } else {
        // Vertical movement
        if (direction.y > 0) {
          this.changeAction("walk_S"); // Move down
        } else {
          this.changeAction("walk_N"); // Move up
        }
      }
    } else {
      this.changeAction("idle"); // Stop animation if not moving
    }
  }

  // Change animation action
  changeAction(next) {
    if (this.cur_action !== next) {
      this.cur_action = next;
      this.cur_frame = 0;
      resetCurrentCharacter(); // Update text bar if needed
      text_bar.changeText(next); // Update animation text
    }
  }

  // Display the current frame
  show() {
    push();
    imageMode(CENTER);
    let frames = this.animations[this.cur_action];
    if (frames && frames.length > 0) {
      let currentImage = frames[this.cur_frame % frames.length];
      image(
        currentImage,
        this.position.x,
        this.position.y,
        currentImage.width * this.scale,
        currentImage.height * this.scale
      );
      this.cur_frame++;

      //  will be used for borderzz
      this.width = currentImage.width * this.scale
      this.height = currentImage.height * this.scale
    }
    strokeWeight(6);
    stroke(255);
    point(this.position.x, this.position.y);
    pop();
    
  }

  // Update position and velocity
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.updateDirection(); // Update animation based on direction
  }

  // Keep the boid within screen bounds
  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  // Flocking behavior: alignment, cohesion, separation
  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(0.5);
    cohesion.mult(0.5);
    separation.mult(1.5);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }


  // avoid_player(TenderBud){
  //   let min_distance = this.width + (this.width /2)
  //   let cur_distance = dist(this.position.x,this.position.y, TenderBud.x,TenderBud.y)

  //   if(cur_distance <= min_distance){

  //   }
  // }

  
}
