// Grid constants
var PLAYER_GRID_Y = 83;
var PLAYER_GRID_Y_TOP_EMPTY_SPACE = 50;
var PLAYER_GRID_Y_BOTTOM_EMPTY_SPACE = 20;
var MAX_PLAYER_MOVE_UP = 1 * PLAYER_GRID_Y + PLAYER_GRID_Y_TOP_EMPTY_SPACE;
var MAX_PLAYER_MOVE_DOWN = 5 * PLAYER_GRID_Y - PLAYER_GRID_Y_BOTTOM_EMPTY_SPACE;
var PLAYER_GRID_X = 101;
var MAX_PLAYER_MOVE_LEFT = 0;
var MAX_PLAYER_MOVE_RIGHT = 4 * PLAYER_GRID_X
// Enemy Speed Min Max constants
var MIN_ENEMY_SPEED = 200;
var MAX_ENEMY_SPEED = 500;
// Enemy Spawn
var ENEMY_SPAWN = 10;



// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Actor Super Class
var Actor = function(x, y, img) {
    this.x = x;
    this.y = y;
    this.sprite = img;
}
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //this.sprite = 'images/enemy-bug.png';
    Actor.call(this, x, y, 'images/enemy-bug.png');
    
    // Determines a random speed for the enemy 
    this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
}
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    // Resets the enemy sprite once it goes off screen to the right
    if(this.x > PLAYER_GRID_X * 5) {
        this.x = PLAYER_GRID_X * -1;
        this.y = PLAYER_GRID_Y * getRandomInt(1, 4) - PLAYER_GRID_Y_BOTTOM_EMPTY_SPACE;
        this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
    }
    this.x = this.x + this.speed * dt;
}

// Player Class
var Player = function(x, y) {
    Actor.call(this, x, y, 'images/char-boy.png');
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(keyCode) {
    if(keyCode == "up" && this.y > MAX_PLAYER_MOVE_UP) this.y = this.y - PLAYER_GRID_Y;
    else if(keyCode == "down" &&  this.y < MAX_PLAYER_MOVE_DOWN) this.y = this.y + PLAYER_GRID_Y;
    else if(keyCode == "left" && this.x > MAX_PLAYER_MOVE_LEFT) this.x = this.x - PLAYER_GRID_X;
    else if(keyCode == "right" && this.x < MAX_PLAYER_MOVE_RIGHT) this.x = this.x + PLAYER_GRID_X;
}
Player.prototype.update = function(dt) {
    
}


// Instantiate Player Object
var player = new Player(PLAYER_GRID_X * 2, PLAYER_GRID_Y * 5 - PLAYER_GRID_Y_BOTTOM_EMPTY_SPACE);

// Instantiate Enemy Object in an array
var allEnemies = new Array();
for (var i = 0; i < ENEMY_SPAWN; i++)
    allEnemies.push(new Enemy(PLAYER_GRID_X * -1, PLAYER_GRID_Y * getRandomInt(1, 4) - PLAYER_GRID_Y_BOTTOM_EMPTY_SPACE));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
