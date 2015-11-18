/// <reference path="phaser.js" />

function mainMenu() {
    var mainMenu = new Phaser.State();

    //mainMenu.game = new Phaser.Game();

    mainMenu.create = function () {
        mainMenu.game.add.button(350, 130, 'play', playGame);
    }

    function playGame() {
        mainMenu.game.state.start('inGame');
    }

    return mainMenu;
}

function inGame() {
    var inGame = new Phaser.State();
    var player, enemies, ground, coins, backgrounds;

    //inGame.game = new Phaser.Game();

    inGame.create = function () {

    }

    inGame.update = function () {

    }

    inGame.render = function () {

    }

    return inGame;
}