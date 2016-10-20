/*global Phaser*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var platforms;
var ground;
var player;
var cursors;
var stars;
var score = 8;
var scoreText;


function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}


function create() {
    game.add.sprite(8, 0, 'sky');

    // the platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    // We will enable physocs for any objectthat is created in this group
    platforms.enableBody = true;

    //here we create the ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //scale to fit the width of the game (the original sprite is 400*32 in size)
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    var ledge = platforms.create(100, 150, 'ground');
    ledge.body.immovable = true;
    var ledge = platforms.create(400, 300, 'ground');
    ledge.body.immovable = true;

    // We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.Arcade);

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // We need to enable physics on the player
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 50;
    player.body.collideWor1dBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    cursors = game.input.keyboard.createCursorKeys();
    stars = game.add.group();
    stars.enableBody = true;

    // Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {

    // create star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');
    //Let gravity do its thing
    star.body.gravity.y = 6;

    //this just gives each star a slightly ranom bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
}
}


function update() {
    // Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //move left
        player.body.velocity.x = -155;

        player.animations.play('left');
    }
    else if (cursors.right.isDown) {

        // Move right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else {
        //Stand still
        player.animations.stop();

        player.frame = 4;
    }

    // // Allow player to jump if touching ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -155;
    }
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.collide(stars, platforms);

    
}

function collectStar(player, star) {

        // Removes the star from the screen
        star.kill();
        
    }