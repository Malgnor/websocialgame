/// <reference path="phaser.js" />
/// <reference path="states.js" />

(function () {
    var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create});
    var user = new User();

    function preload() {
        game.load.image('menuBackground', 'Images/menu.jpg');
        game.load.image('background', 'Images/fase01R.png');
        game.load.image('gameOver', 'Images/gameOver.jpg');
        game.load.image('ground', 'Images/ground.png');
        game.load.image('play', 'Images/play.png');
        game.load.image('back', 'Images/back.png');
        game.load.image('compartilhar', 'Images/compart.png');
        game.load.image('curta', 'Images/curtir.png');
        game.load.image('invite', 'Images/invite.png');
        game.load.image('greenRune', 'Images/extraLife.png');
        game.load.image('purpleRune', 'Images/doubleCoin.png');
        game.load.image('redRune', 'Images/invulnerability.png');
        game.load.image('blueRune', 'Images/magnet.png');
        game.load.image('crown', 'Images/crown.png');
        game.load.spritesheet('enemy', 'Images/inimigo.png', 40, 70);
        game.load.spritesheet('coin', 'Images/moeda.png', 32, 32);
        game.load.spritesheet('player', 'Images/scott.png', 108, 140);
    };

    function create() {
        game.user = user;
        game.topFive = getTopFive;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.add("inGame", inGame());
        game.state.add("gameOver", gameOver());
        game.state.add("mainMenu", mainMenu(), true);
    };

    function User() {
        var self = this;
        this.UserID = 0;
        this.FBID = 0;
        this.Name = "Guest";

        this.Coins = 0;
        //this.spentCoins = 0;
        this.TotalCoins = 0;
        this.HighestCoins = 0;

        this.HighestDistance = 0;
        this.TotalDistance = 0;

        this.HighestScore = 0;

        this.updateStats = function (Coins, distance, score) {
            self.Coins += Math.floor(Coins);
            self.TotalCoins += Math.floor(Coins);
            if (Coins > self.HighestCoins) {
                self.HighestCoins = Math.floor(Coins);
            }

            self.TotalDistance += Math.floor(distance);
            if (distance > self.HighestDistance) {
                self.HighestDistance = Math.floor(distance);
            }

            if (score > self.HighestScore) {
                self.HighestScore = Math.floor(score);
            }
        };

        this.saveMe = function () {
            if (self.FBID === 0) return;
            //console.log("Save");
            saveUser({UserID: self.UserID,
                FBID: self.FBID,
                Name: self.Name = "Guest",
                Coins: self.Coins,
                TotalCoins: self.TotalCoins,
                HighestCoins: self.HighestCoins,

                HighestDistance: self.HighestDistance,
                TotalDistance: self.TotalDistance,
                HighestScore: self.HighestScore});
        };

        var onLoadMe = function (loadedUser) {
            //console.log("onLoadMe");
            //console.log(loadedUser);
            self.UserID = loadedUser.UserID;
            self.FBID = loadedUser.FBID;
            self.Name = loadedUser.Name;

            self.Coins = loadedUser.Coins;
            //self.spentCoins = loadedUser.spentCoins;
            self.TotalCoins = loadedUser.TotalCoins;
            self.HighestCoins = loadedUser.HighestCoins;

            self.HighestDistance = loadedUser.HighestDistance;
            self.TotalDistance = loadedUser.TotalDistance;

            self.HighestScore = loadedUser.HighestScore;
            //console.log(self);
        };

        this.loadMe = function () {
            //console.log("loadMe");
            loadUser(self.FBID, onLoadMe);
        };

        return this;
    };

    function saveUser(userToSave) {
        //console.log("saveUser");
        //console.log(userToSave);
        $.ajax({ url: "existsFB/" + userToSave.FBID }).done(function (response) {
            //console.log("existsFB/" + userToSave.FBID);
            //console.log(response);
            if (response) {
                //console.log(userToSave);
                $.ajax({
                    method: "PUT",
                    url: "api/Users/" + userToSave.UserID,
                    data: userToSave
                }).done(function (msg) {
                    //console.log("PUT/api/Users/" + userToSave.UserID);
                }).error(ajaxError);
            } else {
                //console.log(userToSave);
                $.ajax({
                    method: "POST",
                    url: "api/Users",
                    data: userToSave
                }).done(function (userSaved) {
                    user.UserID = userSaved.UserID;
                    //console.log("POST/api/Users");
                    //console.log(userSaved);
                    //console.log(user);
                }).error(ajaxError);
            }
        }).error(ajaxError);
    };

    function loadUser(id, callback) {
        $.ajax({ url: "existsFB/" + id }).done(function (response) {
            //console.log("existsFB/" + id);
            //console.log(response);
            if (response) {
                $.ajax({ url: "getFb/" + id }).done(function (userLoaded) {
                    //console.log("getFb/" + id);
                    callback(userLoaded);
                }).error(ajaxError);
            }
        }).error(ajaxError);
    };

    function getTopFive() {
        $.ajax({ url: "topFive" }).done(function (response) {
            var message = "Top 5:\n";
            for (var i = 0; i < response.length; i++) {
                message += (1+i) + " - Name: " + response[i].Name
                    + "  Distance: " + response[i].HighestDistance
                    + "  Coins: " + response[i].HighestCoins
                    + "  Score: " + response[i].HighestScore + "\n";
            }
            alert(message);
        }).error(ajaxError);
    }

    function ajaxError(msg) {
        console.log(msg);
    };

}());

