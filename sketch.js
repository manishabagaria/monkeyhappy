var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey , monkey_running, monkey_collided;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var ground,invisibleground;
var restart,restartImg,gameOver,gameoverImg;
var survivaltime = 0;
var Banana = 0;

function preload(){
  
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  monkey_collided = loadAnimation("monkey.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  restartImg = loadImage("Restart.png");
  gameoverImg = loadImage("gameover.png");
}



function setup() {
  createCanvas(600,400);
  
  //create Monkey
  monkey = createSprite(80,315,20,20);
  monkey.addAnimation("running",monkey_running);
  monkey.scale = 0.1;
  
  
  //create ground
  ground = createSprite(600,350,1200,10);
  ground.x = ground.width/2;
  ground.velocityX = -4;
  
  //making invisible ground
  invisibleground = createSprite(80,350,80,5);
  invisibleground.visible = false;
  
  gameOver = createSprite(300,130);
  gameOver.addImage(gameoverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,220);
  restart.addImage(restartImg);
  restart.scale = 0.3;
  
  //create group of Food and obstacle
  FoodGroup = createGroup();
  obstacleGroup = createGroup();
  
  
  //monkey.debug = true;
}


function draw() {
  background("lightblue");
  
  if(gameState === PLAY){
    
   //jump when the space key is pressed
    if(keyDown("space") && monkey.y>=305) {
        monkey.velocityY = -18;
    }
    
    //scrolling the ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //destroying banana 
    if(FoodGroup.isTouching(monkey)){
       FoodGroup.destroyEach();
       Banana = Banana+1;
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 1;
    
    //Scoring
    survivaltime = survivaltime+ Math.round(getFrameRate()/60);
    
    food();
    rock();
    
    gameOver.visible = false;
    restart.visible = false;
    
    //chnaging the gameState
    if(obstacleGroup.isTouching(monkey)){
      gameState = END;
    }
  }
  
  if(gameState === END){
    
   //change the monkey animation
   monkey.changeAnimation("collided", monkey_collided);
  
    
      ground.velocityX = 0;
      monkey.velocityY = 0;
      
 //set lifetime of the game objects so that they are never   destroyed
    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);
     
    //set velocityX zero
     obstacleGroup.setVelocityXEach(0);
     FoodGroup.setVelocityXEach(0);  
    
    restart.visible = true;
    gameOver.visible = true;
    
    if(mousePressedOver(restart)) {
      reset();
    }
    
  }
  
    //stop monkey from falling down
    monkey.collide(invisibleground);
  
    //score visible
    textSize(20);
    stroke("black");
    fill("black")
    text("Survival Time : "+survivaltime,100,50);
    text("Banana : "+Banana,400,50)
  
  drawSprites();
}

function reset(){
 
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  survivaltime = 0;
  Banana = 0;
  
  obstacleGroup.destroyEach();
  FoodGroup.destroyEach();
  
  monkey.changeAnimation("running",monkey_running); 
  
  
}

function food(){
  if(frameCount % 80 === 0){
    banana = createSprite(610,180,10,10);
    banana.y = Math.round(random(120,200));
    banana.addImage(bananaImage);
    banana.velocityX = -(7+Banana/3);
    banana.scale = 0.1;
    banana.lifetime = 89;
    
    FoodGroup.add(banana);
    
  }
}

function rock(){
  if(frameCount % 90 === 0){
  obstacle = createSprite(610,307,10,10);
  obstacle.addImage(obstacleImage);
  obstacle.velocityX = -(9+Banana/3);
  obstacle.scale = 0.2;
  obstacle.lifetime = 72;
  obstacle.setCollider("circle",0,0,160); 
  //obstacle.debug = true
  obstacleGroup.add(obstacle);
  }
}
