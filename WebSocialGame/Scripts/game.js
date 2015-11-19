/// <reference path="phaser.js" />
/// <reference path="states.js" />

(function () {
    var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create});

    function preload() {
        game.load.image('background', 'Images/fase01R.png');
        game.load.image('ground', 'Images/ground.png');
        game.load.image('play', 'Images/play.png');
        game.load.spritesheet('enemy', 'Images/inimigo.png', 40, 70);
        game.load.spritesheet('coin', 'Images/moeda.png', 32, 32);
        game.load.spritesheet('player', 'Images/scott.png', 108, 140);
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.add("inGame", inGame());
        game.state.add("mainMenu", mainMenu(), true);
    }

}());