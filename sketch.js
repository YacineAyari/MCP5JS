
var bombsize = 10;
var bombs = [];
var bombTotal = 10;
var shots = [];

var bombfallspeed = 1;

var shotspeed = 0.01;
var lostbombs = 0;
var touchbomb = 0;

function setup() {
  // put setup code here
  createCanvas(600, 600);
  for (var i = 0; i < bombTotal; i++){
    bombs[i] = new Bomb();
  }
}

function draw() {
  // put drawing code here
  background(51);
  ellipse(width/2,height,60,30);
  push();
  translate(width/2,height);
  rotate(constrain(radians(mouseX),3*PI/4, 5*PI/4));
  line(0,0,0,35);
  pop();

  for (var i = 0; i < bombs.length; i++){
    if(bombs[i].visible === false){
    	bombs.splice(i,1);
    }else{
    	bombs[i].update();
    }
  }

	for (var i = bombs.length; i< bombTotal;i++){
		bombs[i] = new Bomb();
	}

  for (var i = 0; i < shots.length; i++){
    if (shots[i].visible === false){
  		shots.splice(i,1);
  	}else{
  		shots[i].show();
  	}
  }

  for(var i = 0; i< shots.length;i++){
  	if (shots[i].explode === true){
  		  	for (var j = 0; j< bombs.length; j++){
		  		var distance = int(dist(shots[i].endpoint.x, shots[i].endpoint.y, bombs[j].x, bombs[j].y));
		  		if (distance <= shots[i].eSizeStart){
		  			bombs[j].visible = false;
		  			touchbomb++;
		  			bombfallspeed+=0.05;
		  			shotspeed+=0.0025;
		  			console.log(bombfallspeed);
		  			console.log(shotspeed);
		  		}
  			}
  	}
  }
  push();
  fill(0, 102, 153);
  stroke(0,102,153);
  textSize(32);
  text(lostbombs, width-100, 50, width, height); 
  text(touchbomb, 100, 50, width, height);
  pop();
  }

function Bomb() {

  this.x = floor(random(width));
  this.y = floor(random(0, -height));
  this.fallspeed = bombfallspeed * random(0.5,0.7);
  this.visible = true;

  this.update = function() {
    this.y = this.y + this.fallspeed;
    this.x = constrain(this.x, 0, width-bombsize);
    this.y = constrain(this.y, -height, height-bombsize);

    if (this.y < height-bombsize*2){
      fill(255);
      stroke(255);
      ellipse(this.x, this.y, bombsize, bombsize*1.5);
      triangle(this.x - bombsize/2, this.y - bombsize, this.x + bombsize/2, this.y - bombsize, this.x , this.y );
    } else{
      lostbombs++;
      this.visible = false;
    }
  }
}

function mousePressed(){
    append(shots, new Shot(mouseX, mouseY));
}

function Shot(PTRX,PTRY) {
  
  this.startpoint = createVector(width/2,height);
  this.endpoint = createVector(width/2,height);
  this.pointToReach = createVector(PTRX,PTRY);
  this.speed =  0.3;
  this.eSizeStart = 2;
  this.esizeFinal = 50;
  this.visible = true;
  this.explode = false;

  this.show = function() {
   	if ((floor(this.endpoint.x) && floor(this.endpoint.y)) === (floor(this.pointToReach.x) && floor(this.pointToReach.y))){
  		
   		if (this.eSizeStart > this.esizeFinal/2){
   			   			this.explode = true;
   		}

   		if (this.eSizeStart >this.esizeFinal-1){
   			this.esizeFinal = 0;
   		}
   		
   		if (this.eSizeStart<1){
   			this.visible = false;
   		}else{
   			   		this.eSizeStart = lerp(this.eSizeStart,this.esizeFinal, this.speed);
  		ellipse(this.pointToReach.x, this.pointToReach.y, this.eSizeStart, this.eSizeStart);
   		}
  	}else{
  		this.endpoint.x = lerp(this.endpoint.x,this.pointToReach.x,this.speed);
	    this.endpoint.y = lerp(this.endpoint.y, this.pointToReach.y, this.speed);
	    line(this.startpoint.x, this.startpoint.y, this.endpoint.x, this.endpoint.y);
  	}
  }
}