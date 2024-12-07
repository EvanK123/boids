
function textBar(){
    //coordinates for textbar
    this.x = windowWidth/2;
    this.y = windowHeight - (windowHeight /6);
    let barHeight = windowHeight - this.y + (windowHeight / 10);
    let barWidth = windowWidth - (windowWidth/20);
    let barMargin = barHeight / 5;
    //text & current character for animation
    currentCharacter = 0;
    let textInput = "";
    this.show = function() {
        //border
        push();
        let c = color('#739BD0');
        c.setAlpha(230);
        fill(c);
        rectMode(CENTER);
        strokeWeight(5);
        rect(this.x,this.y,barWidth, barHeight , 30 , 30 , 30 , 30);
        pop();
    }
    //resizing textbar coordinates with screen size
    this.resizeTextbar = function(width,height){
        this.x = width/2;
        this.y = height - (height /6);
        barHeight = height - this.y + (height/10);
        barWidth = width - (width/20);
        barMargin = barHeight / 5 - 10;
    }
    //take input from json
    this.animateText = function(input){
        // typewriter style animation for text
        push();
        //set current text to input
        textInput = input;
        //current string the input string from 0 to the current character
        let currString = textInput.substring(0, currentCharacter);
        textSize(35);
        textFont(`Courier`);
        textAlign(CENTER, CENTER);
        rectMode(CENTER);
        text(currString, this.x , this.y, barWidth - barMargin*4, barHeight -barMargin);
        pop();
        //increase current character to have animated effect
        currentCharacter += random(0.2,0.7);
    }
    
    this.changeText = function(  text ){
        this.text = text;
    }
}