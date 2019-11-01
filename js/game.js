
// weapons
const weapons = [{
  name: "Dagger",
  damage: 15,
  className: "weapon-1",
  image: "images/dagger.png"
 },
 {
  name: "Sword",
  damage: 20,
  className: "weapon-2",
  image: "images/sword.png"
 },
 {
  name: "Axe",
  damage: 25,
  className: "weapon-3",
  image: "images/axe.png"
 },
 {
  name: "Killer",
  damage: 30,
  className: "weapon-4",
  image: "images/viking_sword.png"
 },
];
//Players
const Player = function(id) {
 this.id = id;
 this.position = {
  x: 0,
  y: 0
 };
 this.life = 100;
 this.hasWeapon = false;
 this.currentWeapon = weapons[0];
 this.isDefending = false;
}
const player1 = new Player("player-1");
const player2 = new Player("player-2");
const generateRandomNum = () => Math.floor(Math.random() * 10);
// Generate grid for game board with blocks using IIFE function.
(function() {
 for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
   $('.main').append('<div class="grid" data-y=' + i + ' data-x=' + j + '> </div>');
  }
 }
})()
// Loop to elements to display them on the board
function generate(func, time) {
 for (let i = 0; i < time; i++) {
  func();
 }
}
// This functions checks available square and place blocks, weapons and players on the board
function placeElements(className) {
 const random_x = generateRandomNum();
 const random_y = generateRandomNum();
 $('.grid').each(function() {
  const element = $(this);
  if (this.dataset['x'] == random_x && this.dataset['y'] == random_y) {
   if (!(this.classList.contains("unavailable"))) {
    element.addClass(className);
    element.addClass("unavailable");
    // updates the position of the player objects.
    if (className === "player-1") {
     player1.position.x = this.dataset['x'];
     player1.position.y = this.dataset['y'];
    } else if (className === "player-2") {
     player2.position.x = this.dataset['x'];
     player2.position.y = this.dataset['y'];
    } else if (className === "weapon-1" ||
     className === "weapon-2" ||
     className === "weapon-3" ||
     className === "weapon-4") {
     element.addClass("weapon");
    }
   } else {
    placeElements(className);
   }
  }
 });
}
let currentPlayer;
// Clean all the board
function reset() {
 $('.grid').each(function() {
  const element = $(this);
  element.removeClass("block");
  element.removeClass("weapon");
  element.removeClass("weapon-1");
  element.removeClass("weapon-2");
  element.removeClass("weapon-3");
  element.removeClass("weapon-4");
  element.removeClass("cactus");
  element.removeClass("shield");
  element.removeClass("player-1");
  element.removeClass("player-2");
  element.removeClass("possible");
  element.removeClass("unavailable");
  statReset();
 });
 currentPlayer = player1;
}
// This functions generates que board calling on the diferent pieces
function generateGame() {
 reset();
 $("#start-button").css("display","none");
 generate(function() {
  placeElements("block");
 }, 12);
 generate(function() {
  placeElements("weapon-2");
 }, 1);
 generate(function() {
  placeElements("weapon-3");
 }, 1);
 generate(function() {
  placeElements("weapon-4");
 }, 1);
 generate(function() {
  placeElements("cactus");
 }, 6);
 generate(function() {
  placeElements("shield");
 }, 1);
 generate(function() {
  placeElements("player-1");
 }, 1);
 generate(function() {
  placeElements("player-2");
 }, 1);
 pathHighlight();
 playerMove();
 weaponDisplay(player1);
 weaponDisplay(player2);
 displayStats(player1);
 displayStats(player2);
}

function playerMove() {
 $('.grid').click(function() {
  const element = $(this);
  if (element.hasClass("possible")) {
   $('.grid').removeClass(currentPlayer.id);
   $('.grid').removeClass("possible");
   element.addClass(currentPlayer.id);
   currentPlayer.position.x = this.dataset['x'];
   currentPlayer.position.y = this.dataset['y'];
   $(".possible > .block").removeClass('possible');
   if (faceToface())
    handleFight()
   else
    resetPlayer();
  }
 })
}
//player reset
function resetPlayer() {
 currentPlayer = currentPlayer.id == player1.id ? player2 : player1;
 pathHighlight();

}
//function to check occupied square
function divOccupied(element) {
 return (
  element.hasClass("block") ||
  element.hasClass("player-1") ||
  element.hasClass("player-2")
 );
}
//path for players
function pathHighlight() {
 $('.grid').each(function() {
  const element = $(this);
  const block = this;
  if (checkDistance(currentPlayer, block) && !divOccupied(element)) {
   element.addClass("possible");
  }
 });
 $('.grid').click(function() {
  const element = $(this);
  const block = this;
  if (element.hasClass("possible")) {
   if (currentPlayer === player2) {
    checkWeapon(block, currentPlayer);
    handleWeapon(element, currentPlayer);
    displayStats(currentPlayer);
   }
   if (currentPlayer === player1) {
    checkWeapon(block, currentPlayer);
    handleWeapon(element, currentPlayer);
    displayStats(currentPlayer);
   }
  }
 });
 //Remove possiable path if there is obstacle.
 $('.grid').each(function() {
  const element = $(this);
  const block = this;
  if (checkDistance(currentPlayer, block) && (block.dataset['x'] > currentPlayer.position.x)) {
   if (divOccupied(element)) {
    const occupied = this;
    $('.possible').each(function() {
     const element = $(this);
     const block = this;
     if (block.dataset['x'] > occupied.dataset['x']) {
      element.removeClass("possible");
     }
    });
   }
  }
  if (checkDistance(currentPlayer, block) && (block.dataset['x'] < currentPlayer.position.x)) {
   if (divOccupied(element)) {
    const occupied = this;
    $('.possible').each(function() {
     const element = $(this);
     const block = this;
     if (block.dataset['x'] < occupied.dataset['x']) {
      element.removeClass("possible");
     }
    });
   }
  }
  if (checkDistance(currentPlayer, block) && (block.dataset['y'] > currentPlayer.position.y)) {
   if (divOccupied(element)) {
    const occupied = this;
    $('.possible').each(function() {
     const element = $(this);
     const block = this;
     if (block.dataset['y'] > occupied.dataset['y']) {
      element.removeClass("possible");
     }
    });
   }
  }
  if (checkDistance(currentPlayer, block) && (block.dataset['y'] < currentPlayer.position.y)) {
   if (divOccupied(element)) {
    const occupied = this;
    $('.possible').each(function() {
     const element = $(this);
     const block = this;
     if (block.dataset['y'] < occupied.dataset['y']) {
      element.removeClass("possible");
     }
    })
   }
  }
 })

}
//checking distances.
function checkDistance(player, block) {
 //Math abs() Return the absolute value of different numbers
 const conditionOne = (Math.abs(block.dataset['x'] - currentPlayer.position.x) <= 3) &&
  (block.dataset['y'] === currentPlayer.position.y);
 const conditionTwo = (Math.abs(block.dataset['y'] - currentPlayer.position.y) <= 3) &&
  (block.dataset['x'] === currentPlayer.position.x);
 return (conditionOne || conditionTwo);
}
//checking  weapon in all direction.
function checkWeapon(block, player) {
 leftSide(block, player);
 downSide(block, player);
 rightSide(block, player);
 upSide(block, player);
}

function leftSide(block, player) {
 if (block.dataset['x'] < currentPlayer.position.x) {
  $('.possible').each(function() {
   const element = $(this);
   const innerBlock = this;
   if ((innerBlock.dataset['x'] < currentPlayer.position.x) &&
    (innerBlock.dataset['y'] == currentPlayer.position.y) &&
    innerBlock.dataset['x'] > block.dataset['x']) {
    if (element.hasClass("weapon") ||
     element.hasClass("shield") ||
     element.hasClass("cactus")) {
     replaceWeapon(element, player);
    }
   }
  })
 }
}

function rightSide(block, player) {
 if (block.dataset['x'] > currentPlayer.position.x) {
  $('.possible').each(function() {
   const element = $(this);
   const innerBlock = this;
   if ((innerBlock.dataset['x'] > currentPlayer.position.x) &&
    (innerBlock.dataset['y'] == currentPlayer.position.y) &&
    (innerBlock.dataset['x'] < block.dataset['x'])) {
    if (element.hasClass("weapon") ||
     element.hasClass("shield") ||
     element.hasClass("cactus")) {
     replaceWeapon(element, player);
    }
   }
  })
 }
}

function downSide(block, player) {
 if (block.dataset['y'] < currentPlayer.position.y) {
  $('.possible').each(function() {
   const element = $(this);
   const innerBlock = this;
   if ((innerBlock.dataset['y'] < currentPlayer.position.y) &&
    (innerBlock.dataset['x'] == currentPlayer.position.x) &&
    innerBlock.dataset['y'] > block.dataset['y']) {
    if (element.hasClass("weapon") ||
     element.hasClass("shield") ||
     element.hasClass("cactus")) {
     replaceWeapon(element, player);
    }
   }
  })
 }
}

function upSide(block, player) {
 if (block.dataset['y'] > currentPlayer.position.y) {
  $('.possible').each(function() {
   const element = $(this);
   const innerBlock = this;
   if ((innerBlock.dataset['y'] > currentPlayer.position.y) &&
    (innerBlock.dataset['x'] == currentPlayer.position.x) &&
    innerBlock.dataset['y'] < block.dataset['y']) {
    if (element.hasClass("weapon") ||
     element.hasClass("shield") ||
     element.hasClass("cactus")) {
     replaceWeapon(element, player);
    }
   }
  })
 }
}
// If there is a weapon replace it
function replaceWeapon(element, player) {
 let playerWeapon = player.currentWeapon;
 if (element.hasClass("weapon-1")) {
  element.removeClass("weapon-1");
  element.addClass(playerWeapon.className);
  player.currentWeapon = weapons[0];
  weaponDisplay(player);
 } else if (element.hasClass("weapon-2")) {
  element.removeClass("weapon-2");
  element.addClass(playerWeapon.className);
  player.currentWeapon = weapons[1];
  weaponDisplay(player);
 } else if (element.hasClass("weapon-3")) {
  element.removeClass("weapon-3");
  element.addClass(playerWeapon.className);
  player.currentWeapon = weapons[2];
  weaponDisplay(player);
 } else if (element.hasClass("weapon-4")) {
  element.removeClass("weapon-4");
  element.addClass(playerWeapon.className);
  player.currentWeapon = weapons[3];
  weaponDisplay(player);
 } else if (element.hasClass("cactus")) {
  element.removeClass("cactus");
  player.life -= 15;
 } else if (element.hasClass("shield")) {
  element.removeClass("shield");
  if(player.life < 90){
     player.life += 10;
  };
 }
}
//show current weapon
function weaponDisplay(player) {
 if (player === player1) {
  $("#w-display-1").attr("src", player.currentWeapon.image);
 }
 if (player === player2) {

  $("#w-display-2").attr("src", player.currentWeapon.image);
 }
}
function displayStats(player) {
 const weapon = player.currentWeapon.name;
 const life = player.life;
 const damage = player.currentWeapon.damage;
 if (player === player1) {
  document.getElementById("player1-weapon").innerHTML = weapon;
  document.getElementById("player1-life").innerHTML = life;
  document.getElementById("player1-damage").innerHTML = damage;
 } else {
  document.getElementById("player2-weapon").innerHTML = weapon;
  document.getElementById("player2-life").innerHTML = life;
  document.getElementById("player2-damage").innerHTML = damage;
 }
}
// reset all status
function statReset() {
 document.getElementById("player1-weapon").innerHTML = "";
 document.getElementById("player1-life").innerHTML = "";
 document.getElementById("player1-damage").innerHTML = "";
 document.getElementById("player2-weapon").innerHTML = "";
 document.getElementById("player2-life").innerHTML = "";
 document.getElementById("player2-damage").innerHTML = "";
}

function handleWeapon(element, player) {
 replaceWeapon(element, player);
}
// players facing eachother
function faceToface() {
 const xPosition = Math.abs(Number(player1.position.x) - Number(player2.position.x));
 const yPosition = Math.abs(Number(player1.position.y) - Number(player2.position.y));
 return (((xPosition == 0) && (yPosition == 1)) || ((yPosition == 0) && (xPosition == 1)))
}
// Logic to take care of the turns
let playerTurn = true;
let Turn = 0;

function handleFight() {
 $(".main").css("display", "none");
 $("#start-button").css("display", "none");
 $(".left").appendTo("#player1-box").show();
 $(".right").appendTo("#player2-box").show();
 $(".war").show();
 $("#game-tag-line").css("display", "none");
 if (Turn % 2 == 0) {
  $(".left").css("border", "8px solid green");
  $(".right").css("border", "8px solid black");
  $("#p1").text("Player 1 turn");
  $("#p2").text("Player 2 ");
  $(".fightButton1").css("display", "inline-block");
  $(".fightButton2").css("display", "none");
 } else {
  $(".right").css("border", "8px solid green");
  $(".left").css("border", "8px solid black");
  $("#p2").text("Player 2 turn");
  $("#p1").text("Player 1 ");
  $(".fightButton2").css("display", "inline-block");
  $(".fightButton1").css("display", "none");
 }
}
// Logic attacks
function playerAttack() {
 handleFight();
 if (playerTurn) {
  if (player2.isDefending) {
   player2.life -=  (player1.currentWeapon.damage * .5);
   displayStats(player2);
  } else {
   player2.life -=  player1.currentWeapon.damage;
   displayStats(player2);
  }
 } else {
  if (player1.isDefending) {
   player1.life -=   (player2.currentWeapon.damage *.5 );
   displayStats(player1);
  } else {
   player1.life -=  player2.currentWeapon.damage;
   displayStats(player1);
  }
 }
 player1.isDefending = false;
 player2.isDefending = false;
 playerTurn = !playerTurn;
 gameOver();
}
// Defense
function playerDefend() {
 handleFight();
 if (playerTurn) {
  player1.isDefending = true;
  displayStats(player2);
 } else {
  player2.isDefending = true;
  displayStats(player1);
 }
 playerTurn = !playerTurn;
 gameOver();
}
// Check players life .
function gameOver() {
 if (player1.life <= 0) {
  player1.life = 0;
  $('#p2').css("backgroundColor", "green");
  $('.left').css("backgroundColor", "red");
  $('#p2').text("Player 2 Wins");
  $(".fightButton1").css("display", "none");
  $(".fightButton2").css("display", "none");
   $(".restart").fadeIn(2000);
  displayStats(player1);
  $('.left').fadeOut(2000);
 }
 if (player2.life <= 0) {
  player2.life = 0;
  $('#p1').css("backgroundColor", "green");
  $('.right').css("backgroundColor", "red");
  $('#p1').text("Player 1 Wins");
  $(".fightButton1").css("display", "none");
  $(".fightButton2").css("display", "none");
   $(".restart").fadeIn(2000);
  displayStats(player2);
  $('.right').fadeOut(2000);
  }

}
//Attack 
const playerAttack1 = document.getElementById('player-1-attack');
const playerAttack2 = document.getElementById('player-2-attack');
playerAttack1.onclick = function() {
 console.log(playerAttack1);
 Turn++;
 playerAttack();
}
playerAttack2.onclick = function() {
 console.log(playerAttack2);
 Turn++;
 playerAttack();
}
// Defend
const playerDefend1 = document.getElementById('player-1-defend');
const playerDefend2 = document.getElementById('player-2-defend');
playerDefend1.onclick = function() {
 Turn++;
 playerDefend();
}
playerDefend2.onclick = function() {
 Turn++;
 playerDefend();
}
function refreshPage(){
 location.reload();
}