function SnowMan( x , y ){
    this.x = x;
    this.y = y;
    this.r = 50;
    
    this.show = function(){
      push();
      //shadow
      noStroke();
      fill( 120 , 130 , 150 ); 
      ellipse(this.x + 12, this.y +20 , this.r+5, this.r/2);
      
      stroke(180,200,255);
      fill(230);
      circle(this.x , this.y - 62 , this.r - 20);
      //right arm
      push();
      strokeWeight(2);
      stroke(165,135,70);
      line(this.x -10, this.y -35 , this.x -40 , this.y - 60);
      line( this.x -35 , this.y - 56, this.x -33 , this.y - 60 );
      pop();
      
      circle(this.x, this.y - 35, this.r - 10);
      circle(this.x, this.y , this.r);
      pop();
      //eyes 
      push();
      fill(0);
      circle(this.x - 10 , this.y - 65 , 5)
      circle(this.x + 2 , this.y-65, 5);
      //eye highlight
      push();
      fill(255);
      noStroke();
      circle(this.x - 10.5 , this.y - 66 , 2)
      circle(this.x + 1.5 , this.y-66, 2);
      pop();
      //buttons
      circle(this.x-5, this.y - 45, 5);
      circle(this.x-5, this.y - 30, 5);
      circle(this.x-5, this.y - 10, 5);
      //button highlights
      push();
      fill(220);
      circle(this.x-6, this.y - 46, 3);
      circle(this.x-6, this.y - 31, 3);
      circle(this.x-6, this.y - 11, 3);
      pop();
      fill(250,100,50);
      beginShape();
      vertex(this.x , this.y - 60);
      vertex(this.x - 6 , this.y - 56);
      vertex(this.x-20 , this.y - 58);
      vertex(this.x - 7 , this.y - 62);
      endShape();
      //left arm
      strokeWeight(2);
      stroke(165,135,70);
      line(this.x +15, this.y -35 , this.x + 40 , this.y - 50);
      line( this.x+35 , this.y - 47, this.x + 33 , this.y - 50 );
      pop();
      
      
      //hat
      push();
      rectMode(CENTER);
      stroke(0);
      fill(0);
      line(this.x - this.r/2.5 , this.y - 70, this.x + this.r/2.5 , this.y - 70);
      rect(this.x , this.y - 85, this.r-25, this.r - 20 );
      pop();
    }
  }