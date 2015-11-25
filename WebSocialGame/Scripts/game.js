/// <reference path="phaser.js" />
/// <reference path="states.js" />

(function () {
    var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create});
    var user = new User();
    function preload() {
        game.load.image('background', 'Images/fase01R.png');
        game.load.image('ground', 'Images/ground.png');
        game.load.image('play', 'Images/play.png');
        game.load.image('compartilhar', 'Images/compart.png');
        game.load.image('curta', 'Images/curtir.png');
        game.load.image('invite', 'Images/invite.png');
        game.load.spritesheet('enemy', 'Images/inimigo.png', 40, 70);
        game.load.spritesheet('coin', 'Images/moeda.png', 32, 32);
        game.load.spritesheet('player', 'Images/scott.png', 108, 140);
    }

    function create() {
        game.user = user;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.add("inGame", inGame());
        game.state.add("mainMenu", mainMenu(), true);
    }

}());

function User(){
    var self = this;
    this.userID = 0;
    this.fBID = 0;
    this.name = "Guest";
    
    this.coins = 0;
    this.spentCoins = 0;
    this.totalCoins = 0;
    this.highestCoins = 0;
    
    this.highestDistance = 0;
    this.totalDistance = 0;

    this.highestScore = 0;
    
    this.updateStats = function (coins, distance, score) {
        self.coins += coins;
        self.totalCoins += coins;
        if (coins > self.highestCoins) {
            self.highestCoins = coins;
        }

        self.totalDistance += distance;
        if (distance > self.highestDistance) {
            self.highestDistance = distance;
        }

        if (score > self.highestScore) {
            self.highestScore = score;
        }
    };
    
    return this;
}

