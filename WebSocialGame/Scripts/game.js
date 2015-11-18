/// <reference path="phaser.js" />

(function () {
    var game = new Phaser.Game(800, 360, Phaser.AUTO, '', { preload: preload});

    function preload() {
        game.state.add("inGame", inGame());
        game.state.add("mainMenu", mainMenu(), true);
    }
}());