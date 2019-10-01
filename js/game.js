//Weapons
const weapons = [
  { 
    name:"Dagger",
    damage:15,
    className:"weapon-1",
    image:"images/daga.png"

  },
  { 

    name:"Dagger",
    damage:15,
    className:"weapon-2",
    image:"images/daga.png"

  },
  { 

    name:"Dagger",
    damage:15,
    className:"weapon-3",
    image:"images/daga.png"

  },
  { 

    name:"Dagger",
    damage:15,
    className:"weapon-4",
    image:"images/daga.png"

  },

];
//Players
const player1 ={
  position:{
   x:0,
   y:0
  },
  health: 100,
  hasWeapon: false,
  currentWeapon: weapons[0],
  isDefending: false
};
const player2 ={
  position:{
   x:0,
   y:0
  },
  health: 100,
  hasWeapon: false,
  currentWeapon: weapons[0],
  isDefending: false
};


 const generateRandomNum = () => Math.floor(Math.random() * 10);

  // Generate grid for game board with blocks
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      $('.main').append('<div class="grid-item" data-y='+i+' data-x='+j+'>'+i+' '+j+' </div>');
      
    }
  }
  
  // Loop to elements to display them on the board
  function generate(func, times){
    for (let i = 0; i < Number(times); i++) {
      func();
    }
  }
// This functions checks available square and place blocks, weapons and players on the board
function placeElements(className) {
    const random_x = generateRandomNum();
    const random_y = generateRandomNum();
    $('.grid-item').each(function(){
      const element = $(this);
      if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
        if (!(this.classList.contains("unavailable"))){
          element.addClass(className);
          element.addClass("unavailable");
          // updates the position values to the player objects
          if (className === "player-1") {
            player1.position.x = this.dataset['x'];
            player1.position.y = this.dataset['y'];
          } else if (className === "player-2"){
            player2.position.x = this.dataset['x'];
            player2.position.y = this.dataset['y'];
          } else if (className === "weapon-1" ||
                    className === "weapon-2"||
                    className === "weapon-3"||
                    className === "weapon-4"){
            element.addClass("weapon");
            
          }
        
        }else{
          placeElements(className);
        }
        
      }
    });
  }

  // Clean all the board
  function reset() {
    $('.grid-item').each(function(){
      const element = $(this);
      element.removeClass("block");
      element.removeClass("weapon");
      element.removeClass("weapon-1");
      element.removeClass("weapon-2");
      element.removeClass("weapon-3");
      element.removeClass("weapon-4");
      element.removeClass("frostbite");
      element.removeClass("shield");
      element.removeClass("player-1");
      element.removeClass("player-2");
      element.removeClass("possible");
      element.removeClass("unavailable");

       });
  }

  // This functions generates que board calling on the diferent pieces
  function generateGame(){
  reset();
  // Anonymous functions so I can pass the parameters to the function without calling it
  generate(function(){
    placeElements("block");
  },12);
  generate(function(){
    placeElements("weapon-2");
  },1);
  generate(function(){
    placeElements("weapon-3");
  },1);
  generate(function(){
    placeElements("weapon-4");
  },1);
  generate(function(){
    placeElements("frostbite");
  },6);
  generate(function(){
    placeElements("shield");
  },1);
  generate(function(){
    placeElements("player-1");
  },1);
  generate(function(){
    placeElements("player-2");
  },1);
  pathHighlight();
  playerMove();
  
  }
  //Player movement 
/*
const player1Move = function(){
    $('.main').on('click', function(event){
        let value = event.target
        $('.player-1').removeClass('player-1')
        $(value).addClass('player-1')

    });

}
const player2Move = function(){
    $('.main').on('click', function(event){
        let value = event.target
        $('.player-2').removeClass('player-2')
        $(value).addClass('player-2')

    });

}
*/
let currentPlayer = true;
function playerMove (player){
  $('.grid-item').click(function(){
  pathHighlight();
  const element = $(this);
  if (element.hasClass("possible")) {
        if(currentPlayer){
            playerReset("player-1");
            element.addClass('player-1')
            currentPlayer = false;
        }else{
            
            playerReset("player-2");
            element.addClass('player-2')
            currentPlayer = true;
 
        }
        pathHighlight();
      }
      });  

}

// Player position
function PlayerPosition(){
    $('.grid-item').each(function(){
      const element = $(this);
      // take coordinates 
      if (element.hasClass("player-1")) {
        player1.position.x = this.dataset['x'];
        player1.position.y = this.dataset['y'];
      }
      if (element.hasClass("player-2")) {
        player2.position.x = this.dataset['x'];
        player2.position.y = this.dataset['y'];
      }
    });
  }
  //function to check occupied square
function squareOccupied (element) {
    return (
      element.hasClass("block") || 
      element.hasClass("player-1") || 
      element.hasClass("player-2")
      );
  }
//checking distances
   function checkDistance (player, block) {
    //Math abs() Return the absolute value of different numbers
    const conditionOne = (Math.abs(block.dataset['x'] - player.position.x) <= 3)
    && (block.dataset['y'] === player.position.y);
    const conditionTwo = (Math.abs(block.dataset['y'] - player.position.y) <= 3) 
    && (block.dataset['x'] === player.position.x);
    return (conditionOne || conditionTwo);
  }
//possiable path
  function showPath(player) {
    $('.grid-item').each(function(){
      const element = $(this);
      const block = this;
      if (checkDistance(player, block) && !squareOccupied(element)){
        element.addClass("possible");
      }
    });
  }
  //path for players
  function pathHighlight() {
     if (currentPlayer) {
        showPath(player1);
        
       } 
    else {
        showPath(player2);
         
      }
    
  }
  //reset player function
function playerReset(player) {
    $('.grid-item').each(function(){
      const element = $(this);
      element.removeClass(player);
      element.removeClass("possible");
    });
  }