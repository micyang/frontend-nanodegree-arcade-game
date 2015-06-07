// Grid constants
var GRID_Y = 83;
var GRID_X = 101;
var GRID_Y_TOP_EMPTY_SPACE = 50;
var GRID_Y_BOTTOM_EMPTY_SPACE = 20;
var MAX_PLAYER_MOVE_UP = 0 * GRID_Y + GRID_Y_TOP_EMPTY_SPACE;
var MAX_PLAYER_MOVE_DOWN = 5 * GRID_Y - GRID_Y_BOTTOM_EMPTY_SPACE;
var MAX_PLAYER_MOVE_LEFT = 0;
var MAX_PLAYER_MOVE_RIGHT = 4 * GRID_X;
// Player start constant
var PLAYER_START_X = GRID_X * 2;
var PLAYER_START_Y = GRID_Y * 5 - GRID_Y_BOTTOM_EMPTY_SPACE;
// Enemy Speed Min Max constants
var MIN_ENEMY_SPEED = 100;
var MAX_ENEMY_SPEED = 700;
// Enemy Spawn
var ENEMY_SPAWN = 2;
// Hitbox Adjustment
var RIGHT_ADJUST = 83;
var LEFT_ADJUST = 18;
var TOP_ADJUST = 81;
var BOTTOM_ADJUST = 132;
// Enemy Unique Hitbox Adjustment
var ENEMY_RIGHT_ADJUST = 98;
var ENEMY_LEFT_ADJUST = 3;
var ENEMY_TOP_ADJUST = 81;
var ENEMY_BOTTOM_ADJUST = 132;
// Gem Constants
var BLUE_GEM = 'images/Gem Blue.png';
var GREEN_GEM = 'images/Gem Green.png';
var ORANGE_GEM = 'images/Gem Orange.png';
// Player Sprite Constants
var BOY = 'images/char-boy.png';
var CAT_GIRL = 'images/char-cat-girl.png';
var HORN_GIRL = 'images/char-horn-girl.png';
var PINK_GIRL = 'images/char-pink-girl.png';
var PRINCESS_GIRL = 'images/char-princess-girl.png';

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//-------------------------------------------------------------------
// Actor Super Class
//-------------------------------------------------------------------

var Actor = function(x, y, img, right_adj, left_adj, top_adj, bot_adj) {
    this.x = x;
    this.y = y;
    this.right_adj = right_adj;
    this.left_adj = left_adj;
    this.top_adj = top_adj;
    this.bot_adj = bot_adj;
    this.sprite = img;
    this.right = this.x + this.right_adj;
    this.left = this.x + this.left_adj;
    this.top = this.y + this.top_adj;
    this.bottom = this.y + this.bot_adj;
}
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Actor.prototype.updateHitbox = function() {
    this.right = this.x + this.right_adj;
    this.left = this.x + this.left_adj;
    this.top = this.y + this.top_adj;
    this.bottom = this.y + this.bot_adj;
}

//-------------------------------------------------------------------
// Enemy Class
//-------------------------------------------------------------------

var Enemy = function(x, y, right_adj, left_adj, top_adj, bot_adj) {
    Actor.call(this, x, y, 'images/enemy-bug.png', right_adj, left_adj, top_adj, bot_adj);
    // Determines a random speed for the enemy 
    this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
    // Star reset
    this.starReset = false;
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
    // Resets the enemy sprite once it goes off screen to the right
    if(this.x > GRID_X * 5) {
        this.x = GRID_X * -1;
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
    }
    
    // When player grabs the star, enemy resets
    if(this.starReset == true) {
        this.x = GRID_X * -1;
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.speed = getRandomArbitrary(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
        this.starReset = false;
    }
    this.x = this.x + this.speed * dt;
}
/////////////////////////////////////////////////////////////////////
// Player Class
/////////////////////////////////////////////////////////////////////
var Player = function(x, y, right_adj, left_adj, top_adj, bot_adj) {
    this.charSelect = [BOY, CAT_GIRL, HORN_GIRL, PINK_GIRL, PRINCESS_GIRL]
    Actor.call(this, x, y, this.charSelect[getRandomInt(0, 5)], right_adj, left_adj, top_adj, bot_adj);
    this.alive = true;
    this.score = 0;
    this.highScore = 0;
    this.lives = 3;
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
    // Checks to see if player goes into water and gains a point
    if(this.y <= 0 * GRID_Y + GRID_Y_TOP_EMPTY_SPACE) {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        this.sprite = this.charSelect[getRandomInt(0, 5)];
        this.score = this.score + 1;
    }
    
    // Checks to see if player died and reset position
    if(this.alive == false) {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        this.sprite = this.charSelect[getRandomInt(0, 5)];
        this.alive = true;
        if(this.lives == 0){
            this.score = 0;
            this.lives = 3;
        } else {
            this.lives = this.lives - 1;
        }
    }
}
Player.prototype.scoreUpdate = function(value) {
    this.score = this.score + value;
}
Player.prototype.renderStatus = function() {
    ctx.clearRect(0, 20 , 505 , 25);
    ctx.font = "20px serif";
    // Draw scores on the top left
    ctx.fillText("Score: " + this.score, 0, 40);
    // Draw lives on the top right
    ctx.fillText("Lives: " + this.lives, 404, 40);
    // High score during gaming session
    if(this.score > this.highScore) this.highScore = this.score;
    ctx.fillText("High Score: " + this.highScore, 202, 40);
    
}

//-------------------------------------------------------------------
// Gem Class - Player gains points by grabbing gems
//-------------------------------------------------------------------

var Gem = function(x, y, right_adj, left_adj, top_adj, bot_adj) {
    this.gemColor = [BLUE_GEM, GREEN_GEM, ORANGE_GEM];
    // Randomly will choose a gem with a value
    this.value = getRandomInt(0, 3) + 1;
    Actor.call(this, x, y, this.gemColor[this.value - 1], right_adj, left_adj, top_adj, bot_adj);
    this.taken = false;
}
Gem.prototype = Object.create(Actor.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function() {
    // Random type of gem will randomly spawn at a location
    // after player grabs it
    if(this.taken == true) {
        this.value = getRandomInt(0, 3) + 1;
        this.sprite = this.gemColor[this.value - 1];
        // Reset gem in a random location
        this.x = GRID_X * getRandomInt(0, 5);
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.taken = false;
    }
}

//-------------------------------------------------------------------
// Heart Class - Player gains lives by grabbing hearts
//-------------------------------------------------------------------

var Heart = function(x, y, right_adj, left_adj, top_adj, bot_adj) {
    Actor.call(this, x, y, 'images/Heart.png', right_adj, left_adj, top_adj, bot_adj);
    this.taken = false;
}
Heart.prototype = Object.create(Actor.prototype);
Heart.prototype.constructor = Heart;
Heart.prototype.update = function() {
    // Heart will reset after it's taken
    if(this.taken == true) {
        this.x = GRID_X * getRandomInt(0, 5);
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.taken = false;
    }
}

//-------------------------------------------------------------------
// Star Class - Player resets all the enemies by grabbing stars
//-------------------------------------------------------------------
var Star = function(x, y, right_adj, left_adj, top_adj, bot_adj) {
    Actor.call(this, x, y, 'images/Star.png', right_adj, left_adj, top_adj, bot_adj);
    this.taken = false;
}
Star.prototype = Object.create(Actor.prototype);
Star.prototype.constructor = Star;
Star.prototype.update = function() {
    // Star will reset after it's taken
    if(this.taken == true) {
        this.x = GRID_X * getRandomInt(0, 5);
        this.y = GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE;
        this.taken = false;
    }
}

//-------------------------------------------------------------------
// Instantiate Objects
//-------------------------------------------------------------------

// Instantiate Player Object
var player = new Player(PLAYER_START_X, PLAYER_START_Y, RIGHT_ADJUST, LEFT_ADJUST, TOP_ADJUST, BOTTOM_ADJUST);

// Instantiate Enemy Object in an array
var allEnemies = new Array();
for (var i = 0; i < ENEMY_SPAWN; i++)
    allEnemies.push(new Enemy(GRID_X * -1, GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE, ENEMY_RIGHT_ADJUST, ENEMY_LEFT_ADJUST, ENEMY_TOP_ADJUST, ENEMY_BOTTOM_ADJUST));
    
// Instantiate Gem Object
var gem = new Gem(GRID_X * getRandomInt(0, 5), GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE, RIGHT_ADJUST, LEFT_ADJUST, TOP_ADJUST, BOTTOM_ADJUST);

// Instantiate Heart Object
var heart = new Heart(GRID_X * getRandomInt(0, 5), GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE, RIGHT_ADJUST, LEFT_ADJUST, TOP_ADJUST, BOTTOM_ADJUST);

// Instantiate Star Object
var star = new Star(GRID_X * getRandomInt(0, 5), GRID_Y * getRandomInt(1, 4) - GRID_Y_BOTTOM_EMPTY_SPACE, RIGHT_ADJUST, LEFT_ADJUST, TOP_ADJUST, BOTTOM_ADJUST);

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
