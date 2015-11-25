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
    };

    function create() {
        game.user = user;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.add("inGame", inGame());
        game.state.add("mainMenu", mainMenu(), true);
    };

    function User() {
        var self = this;
        this.userID = 0;
        this.fBID = 0;
        this.name = "Guest";

        this.coins = 0;
        //this.spentCoins = 0;
        this.totalCoins = 0;
        this.highestCoins = 0;

        this.highestDistance = 0;
        this.totalDistance = 0;

        this.highestScore = 0;

        this.updateStats = function (coins, distance, score) {
            self.coins += Math.floor(coins);
            self.totalCoins += Math.floor(coins);
            if (coins > self.highestCoins) {
                self.highestCoins = Math.floor(coins);
            }

            self.totalDistance += Math.floor(distance);
            if (distance > self.highestDistance) {
                self.highestDistance = Math.floor(distance);
            }

            if (score > self.highestScore) {
                self.highestScore = Math.floor(score);
            }
        };

        this.save = function () {
            if (self.fBID === 0) return;
            console.log("Save");
            saveUser(self);
        };

        var onLoad = function (loadedUser) {
            self.userID = loadedUser.userID;
            self.fBID = loadedUser.fBID;
            self.name = loadedUser.name;

            self.coins = loadedUser.coins;
            //self.spentCoins = loadedUser.spentCoins;
            self.totalCoins = loadedUser.totalCoins;
            self.highestCoins = loadedUser.highestCoins;

            self.highestDistance = loadedUser.highestDistance;
            self.totalDistance = loadedUser.totalDistance;

            self.highestScore = loadedUser.highestScore;
        };

        this.load = function () {
            console.log("Load");
            loadUser(self.fBID, onLoad);
        };

        return this;
    };

    function saveUser(userToSave) {
        $.ajax({ url: "existsFB/" + userToSave.fBID }).done(function (response) {
            if (response) {
                $.ajax({
                    method: "PUT",
                    url: "api/Users",
                    data: userToSave
                }).done(function (msg) {
                    console.log(msg);
                }).error(ajaxError);
            } else {
                $.ajax({
                    method: "POST",
                    url: "api/Users",
                    data: userToSave
                }).done(function (userSaved) {
                    user.userID = userSaved.userID;
                    console.log(userSaved);
                    console.log(user);
                }).error(ajaxError);
            }
        }).error(ajaxError);
    };

    function loadUser(id, callback) {

        $.ajax({ url: "existsFB/" + id }).done(function (response) {
            if (response) {
                $.ajax({ url: "getFb/" + id }).done(function (userLoaded) {
                    callback(userLoaded);
                }).error(ajaxError);
            }
        }).error(ajaxError);
    };

    function ajaxError(msg) {
        console.log(msg);
    }

}());

