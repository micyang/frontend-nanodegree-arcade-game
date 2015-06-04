// Grid constants
var GRID_Y = 83;
var GRID_Y_TOP_EMPTY_SPACE = 50;
var GRID_Y_BOTTOM_EMPTY_SPACE = 20;
var MAX_PLAYER_MOVE_UP = 1 * GRID_Y + GRID_Y_TOP_EMPTY_SPACE;
var MAX_PLAYER_MOVE_DOWN = 5 * GRID_Y - GRID_Y_BOTTOM_EMPTY_SPACE;
var GRID_X = 101;
var MAX_PLAYER_MOVE_LEFT = 0;
var MAX_PLAYER_MOVE_RIGHT = 4 * GRID_X;
// Player start constant
var PLAYER_START_X = GRID_X * 2;
var PLAYER_START_Y = GRID_Y * 5 - GRID_Y_BOTTOM_EMPTY_SPACE;
// Enemy Speed Min Max constants
var MIN_ENEMY_SPEED = 200;
var MAX_ENEMY_SPEED = 500;
// Enemy Spawn
var ENEMY_SPAWN = 5;
// Player Hitbox Adjustment
var PLAYER_RIGHT_ADJUST = 83;
var PLAYER_LEFT_ADJUST = 18;
var PLAYER_TOP_ADJUST = 81;
var PLAYER_BOTTOM_ADJUST = 132;
// Enemy Hitbox Adjustment
var ENEMY_RIGHT_ADJUST = 98;
var ENEMY_LEFT_ADJUST = 3;
var ENEMY_TOP_ADJUST = 81;
var ENEMY_BOTTOM_ADJUST = 132;


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
    this.right = 0;
    this.left = 0;
    this.top = 0;
    this.bottom = 0;
}
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    Actor.call(this, x, y, 'images/enemy-bug.png');
    
    // Determines a random speed for the enemy 
    this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
}
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Resets the enemy sprite once it goes off screen to the right
    if(this.x > GRID_X * 5) {
        this.x = GRID_X * -1;
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
    }
    this.x = this.x + this.speed * dt;
    
    // Hit box update for enemy sprite
    this.right = this.x + ENEMY_RIGHT_ADJUST;
    this.left = this.x + ENEMY_LEFT_ADJUST;
    this.top = this.y + ENEMY_TOP_ADJUST;
    this.bottom = this.y + ENEMY_BOTTOM_ADJUST;
}

// Player Class
var Player = function(x, y) {
    Actor.call(this, x, y, 'images/char-boy.png');
    this.alive = true;
    
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(keyCode) {
    if(keyCode == "up" && this.y > MAX_PLAYER_MOVE_UP) this.y = this.y - GRID_Y;
    else if(keyCode == "down" &&  this.y < MAX_PLAYER_MOVE_DOWN) this.y = this.y + GRID_Y;
    else if(keyCode == "left" && this.x > MAX_PLAYER_MOVE_LEFT) this.x = this.x - GRID_X;
    else if(keyCode == "right" && this.x < MAX_PLAYER_MOVE_RIGHT) this.x = this.x + GRID_X;
}
Player.prototype.update = function() {
    // Checks to see if player died and reset position
    if(this.alive == false) {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        this.alive = true;
    }
    
    // Hit box update for player sprite
    this.right = this.x + PLAYER_RIGHT_ADJUST;
    this.left = this.x + PLAYER_LEFT_ADJUST;
    this.top = this.y + PLAYER_TOP_ADJUST;
    this.bottom = this.y + PLAYER_BOTTOM_ADJUST;
}
Player.prototype.death = function() {
    this.alive = false;
}


// Instantiate Player Object
var player = new Player(PLAYER_START_X, PLAYER_START_Y);

// Instantiate Enemy Object in an array
var allEnemies = new Array();
for (var i = 0; i < ENEMY_SPAWN; i++)
    allEnemies.push(new Enemy(GRID_X * -1, GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE));

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
