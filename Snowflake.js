function Snowflake( x, y, r ){
    this.x = x;
    this.y = y;
    this.r = r;

    this.dx = random(-1,1)
    this.dy = 1
    
    this.color;
    this.dir ;
  

    //  this determines shade of gray - white based on size
    //  (smaller is grayer bc further away)
    if (this.r >= 4){
      this.color = random(250, 255);
      this.dir =  random( -1 , -0.75 );
    }else if ( this.r >= 3.5){
      this.color = (random(200,230));
      this.dir = random( -0.5 , -0.25 );
    }else {
      this.color = random(190,200);
      this.dir = random( -0.25 , 0 );
    }

    this.show = function(){
      push();
      stroke(200,200,255)

      fill( this.color);
      circle( this.x  , this.y , this.r);
      pop();
         
      
    }
    this.fall = function(){ 
          
      this.x += this.dx ;

      this.y += this.dy
      
      if (this.x <= 0 ){
        this.x += windowWidth + 10;
      }
      if (this.x >= windowWidth ){
        this.x -= windowWidth + 10;
      }
      if (this.y >= windowHeight ){
        this.y -= windowHeight;
        console.log(this.y)
      }
     
    }

}   