/// <reference path="phaser.js" />

function preloadState(){
    var preloader = new Phaser.State();

    preloader.preload = function () {
        preloader.load.setPreloadSprite(preloader.add.sprite(100, 100, 'loading'));
        preloader.load.image('menuBackground', 'Images/menu.jpg');
        preloader.load.image('menuBackground', 'Images/menu.jpg');
        preloader.load.image('background', 'Images/fase01R.png');
        preloader.load.image('gameOver', 'Images/gameOver.jpg');
        preloader.load.image('ground', 'Images/ground.png');
        preloader.load.image('play', 'Images/play.png');
        preloader.load.image('back', 'Images/back.png');
        preloader.load.image('compartilhar', 'Images/compart.png');
        preloader.load.image('curta', 'Images/curtir.png');
        preloader.load.image('invite', 'Images/invite.png');
        preloader.load.image('greenRune', 'Images/extraLife.png');
        preloader.load.image('purpleRune', 'Images/doubleCoin.png');
        preloader.load.image('redRune', 'Images/invulnerability.png');
        preloader.load.image('blueRune', 'Images/magnet.png');
        preloader.load.image('crown', 'Images/crown.png');
        preloader.load.spritesheet('enemy', 'Images/inimigo.png', 40, 70);
        preloader.load.spritesheet('coin', 'Images/moeda.png', 32, 32);
        preloader.load.spritesheet('player', 'Images/scott.png', 108, 140);
        preloader.load.audio("musicMenu", 'Sounds/musicaMenu.mp3');
        preloader.load.audio("musicGame", 'Sounds/musicaFase.mp3');
        preloader.load.audio("jumpSfx", 'Sounds/jumpEffect.mp3');
        preloader.load.audio("gameOverSfx", 'Sounds/gameOverEffect.mp3');
        preloader.load.audio("coinSfx", 'Sounds/coinEffect.mp3');
    };

    preloader.create = function () {
        preloader.state.start('mainMenu');
    }

    return preloader;
};

function mainMenu() {
    var mainMenu = new Phaser.State();
    var textHighDistance, textCoins, textName,
        music;

    mainMenu.create = function () {
        mainMenu.add.sprite(0, 0, 'menuBackground');
        mainMenu.add.button(250, 130, 'play', playGame);
        //mainMenu.add.button(0, 0, 'play', mainMenu.game.topFive);
        //mainMenu.add.button(490, 323, 'compartilhar', compartilhar);
        //mainMenu.add.button(0, 296, 'curta', curtir);
        mainMenu.add.button(210, 284, 'invite', desafiar);
        mainMenu.add.button(570, 5, 'crown', mainMenu.game.topFive);
        music = mainMenu.add.audio('musicMenu', 0.1, true);
        music.play();
        textName = mainMenu.add.text(5, 10, mainMenu.game.user.Name);
        textCoins = mainMenu.add.text(5, 40, "Coins: " + mainMenu.game.user.Coins);
        textHighDistance = mainMenu.add.text(5, 70, "Highest distance: " + (mainMenu.game.user.HighestDistance / 10).toFixed(0));
        textCoins.fill = textName.fill = textHighDistance.fill = 'white';
        textCoins.stroke = textName.stroke = textHighDistance.stroke = 'black';
        textCoins.strokeThickness = textName.strokeThickness = textHighDistance.strokeThickness = 2;

        // INICIALIZA O FACEBOOK -----------------------------------------------
        window.fbAsyncInit = function () {
            FB.init({
                appId: '735977296534812',
                xfbml: true,
                version: 'v2.5'
            });
            FB.getLoginStatus(function (res) {
                if (res.status === 'connected') {
                    mainMenu.game.user.FBID = res.authResponse.userID;
                    mainMenu.game.user.loadMe();
                    getName();
                    //console.log(res);
                    //console.log(mainMenu.game.user);
                }
                else {
                    FB.login(function (res) {
                        if (res.authResponse) {
                            mainMenu.game.user.FBID = res.authResponse.userID;
                            mainMenu.game.user.loadMe();
                            getName();
                            //console.log(res);
                            //console.log(mainMenu.game.user);
                        }
                    }, { scope: "user_friends" });
                }
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // TERMINA A INICIALIZAÇÃO DO FACEBOOK-------------------------------
    };

    mainMenu.update = function () {
        textName.setText(mainMenu.game.user.Name);
        textCoins.setText("Coins: " + mainMenu.game.user.Coins);
        textHighDistance.setText("Highest distance: " + (mainMenu.game.user.HighestDistance / 10).toFixed(0));
    };

    mainMenu.shutdown = function () {
        music.stop();
    }

    /* ---------------------------FUNÇÕES DO FACEBOOK---------------------------------*/
    /*function curtir() {
        FB.ui({
            method: 'like',
            href: 'http://infiniterunner.bitballoon.com/'
        })
    }
    function compartilhar() {
        FB.ui({
            method: 'share',
            href: 'http://infiniterunner.bitballoon.com/'
        })
    }*/

    function desafiar() {
        FB.api(
            "/me/invitable_friends",
            function (response) {
                if (response && !response.error) {

                }
            }
            );
        FB.ui({
            method: 'apprequests',
            message: 'Vem tentar me derrotar!'
        });
    }

    function getName() {
        FB.api('/me', { fields: 'name' }, function (response) {
            if (!response.error) {
                mainMenu.game.user.Name = response.name;
            } else {
                console.log(response);
            }
        });
    };

    /* -------------------------------------------------------------------------------*/

    function playGame() {
        mainMenu.state.start('inGame');
    }

    return mainMenu;
};

function gameOver() {
    var gameOver = new Phaser.State();
    var textHighDistance, textCoins, textName,
        sfx;

    gameOver.create = function () {
        gameOver.add.sprite(0, 0, 'gameOver');
        gameOver.add.button(150, 130, 'play', playGame);
        gameOver.add.button(350, 130, 'back', backToMenu);
        gameOver.add.button(550, 5, 'crown', gameOver.game.topFive);
        sfx = gameOver.add.audio('gameOverSfx', 0.1);
        sfx.play();

        textName = gameOver.add.text(15, 200, gameOver.game.user.Name);
        textCoins = gameOver.add.text(15, 240, "Coins: " + gameOver.game.user.Coins);
        textHighDistance = gameOver.add.text(15, 270, "Highest distance: " + (gameOver.game.user.HighestDistance / 10).toFixed(0));
        textCoins.fill = textName.fill = textHighDistance.fill = 'black';
        textCoins.stroke = textName.stroke = textHighDistance.stroke = 'white';
        textCoins.strokeThickness = textName.strokeThickness = textHighDistance.strokeThickness = 3;
    };

    gameOver.update = function () {
        textName.setText(gameOver.game.user.Name);
        textCoins.setText("Coins: " + gameOver.game.user.Coins);
        textHighDistance.setText("Highest distance: " + (gameOver.game.user.HighestDistance / 10).toFixed(0));
    };

    function playGame() {
        gameOver.state.start('inGame');
    };

    function backToMenu() {
        gameOver.state.start('mainMenu');
    };

    return gameOver;
};

function inGame() {
    var inGame = new Phaser.State();
    var player, enemies, ground, Coins, backgrounds,
    playerSpeed, distance, coinsPicked,
    escapeKey, spacebarKey, leftKey, rightKey, upKey, aKey, dKey, wKey,
    textSpeed, textCoins, textDistance, textEnd,
    playing, targetX, useTarget,
    coinSfx, jumpSfx, music;

    inGame.shutdown = function () {
        music.stop();
    }

    inGame.create = function () {

        coinSfx = inGame.add.audio('coinSfx', 0.1);
        jumpSfx = inGame.add.audio('jumpSfx', 0.1);
        music = inGame.add.audio('musicGame', 0.1, true);
        music.play();

        backgrounds = inGame.add.group();
        backgrounds.create(0, 0, 'background');
        backgrounds.create(1355, 0, 'background');

        Coins = inGame.add.group();
        Coins.enableBody = true;

        enemies = inGame.add.group();
        enemies.enableBody = true;

        player = inGame.add.sprite(25, 160, 'player');
        inGame.physics.arcade.enable(player);
        player.body.gravity.y = 1200;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], playerSpeed * 1.75, true);
        player.scale = new Phaser.Point(0.5, 0.5);
        player.body.setSize(78, 120, 10);

        ground = inGame.add.sprite(0, 300, 'ground');
        ground.alpha = 0;
        inGame.physics.arcade.enable(ground);
        ground.body.immovable = true;

        useTarget = false;
        inGame.input.addMoveCallback(moveHandler, this);

        escapeKey = inGame.input.keyboard.addKey(Phaser.KeyCode.ESC);
        spacebarKey = inGame.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        leftKey = inGame.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        rightKey = inGame.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        upKey = inGame.input.keyboard.addKey(Phaser.KeyCode.UP);
        aKey = inGame.input.keyboard.addKey(Phaser.KeyCode.A);
        dKey = inGame.input.keyboard.addKey(Phaser.KeyCode.D);
        wKey = inGame.input.keyboard.addKey(Phaser.KeyCode.W);

        escapeKey.onDown.addOnce(function () { inGame.state.start("mainMenu"); });

        textSpeed = inGame.add.text(5, 10);
        textCoins = inGame.add.text(5, 35);
        textDistance = inGame.add.text(5, 60);
        textEnd = inGame.add.text(100, 170, 'Press "spacebar" or click to play again!\nPress "escape" to go back to menu!');
        textSpeed.stroke = textCoins.stroke = textDistance.stroke = textEnd.stroke = 'white';
        textSpeed.strokeThickness = textCoins.strokeThickness = textDistance.strokeThickness = 2;
        textEnd.strokeThickness = 3;
        textSpeed.fill = textCoins.fill = textDistance.fill = textEnd.fill = 'black';
        textSpeed.fontSize = textCoins.fontSize = textDistance.fontSize = 15;

        gameReset();
    };

    inGame.update = function () {

        inGame.physics.arcade.collide(ground, player);

        if (!playing) {
            return;
        }

        distance += playerSpeed;

        inGame.physics.arcade.overlap(Coins, player, coinPickup, null, this);
        inGame.physics.arcade.overlap(enemies, player, endGame, null, this);

        backgrounds.forEach(backgroundScroll, this);
        Coins.forEach(coinScroll, this);
        enemies.forEach(enemiesWalk, this);


        if ((spacebarKey.isDown || wKey.isDown || upKey.isDown) && player.body.touching.down) {
            player.body.velocity.y = -600;
            spawnCoin(700, inGame.rnd.between(100, 268));
            spawnEnemy(700 + inGame.rnd.between(0, playerSpeed), 230);
        }

        if (aKey.isDown || leftKey.isDown) {
            player.animations.stop();
            player.body.position.x -= playerSpeed;
            useTarget = false;
        } else if (dKey.isDown || rightKey.isDown) {
            player.animations.getAnimation('right').speed = playerSpeed * 3.5;
            player.animations.play('right');
            player.body.position.x += playerSpeed;
            useTarget = false;
        } else if (useTarget) {
            if (player.body.position.x > targetX) {
                player.animations.stop();
                player.body.position.x -= playerSpeed;
            } else if (player.body.position.x < targetX) {
                player.animations.getAnimation('right').speed = playerSpeed * 3.5;
                player.animations.play('right');
                player.body.position.x += playerSpeed;
            }

            if (player.body.position.x - targetX <= playerSpeed && player.body.position.x - targetX >= -playerSpeed) {
                useTarget = false;
                player.animations.getAnimation('right').speed = playerSpeed * 1.75;
                player.animations.play('right');
            }
        } else {
            player.animations.getAnimation('right').speed = playerSpeed * 1.75;
            player.animations.play('right');
        }

        if (playerSpeed < 30) {
            playerSpeed += 0.0005;
        }

        updateTexts();
    };

    inGame.render = function () {
        // inGame.game.debug.body(player);
        // Coins.forEach(debugDraw, this);
        // enemies.forEach(debugDraw, this);
    };

    function backgroundScroll(background) {
        background.position.x -= playerSpeed;
        if (background.position.x <= -1355) {
            background.position.x += 1355 * 2;
        }
    }

    function coinScroll(coin) {
        coin.body.position.x -= playerSpeed;
        if (coin.position.x < -1355) {
            coin.kill();
        }
    }

    function enemiesWalk(enemy) {
        enemy.body.position.x -= playerSpeed * 1.25;
        if (enemy.position.x < -1355) {
            enemy.kill();
        }
    }

    function killEach(child) {
        child.kill();
    }

    function debugDraw(child) {
        inGame.game.debug.body(child);
    }

    function coinPickup(player, coin) {
        coin.kill();
        coinsPicked++;
        playerSpeed += 0.1;
    }

    function endGame(player, enemy) {
        if (player.body.touching.down && enemy.body.touching.up) {
            enemy.kill();
            player.body.velocity.y = -450;
            return;
        }
        player.alpha = 0.25;
        player.animations.stop();
        spacebarKey.onDown.addOnce(gameReset);
        textEnd.alpha = 1;
        inGame.game.user.updateStats(coinsPicked, distance, 10 * coinsPicked + distance);
        //console.log("EndGame");
        inGame.game.user.saveMe();
        updateTexts();
        playing = false;
        inGame.state.start("gameOver");
    }

    function gameReset() {
        Coins.forEach(killEach, this);
        enemies.forEach(killEach, this);
        playerSpeed = 2;
        distance = coinsPicked = 0;
        player.alpha = 1;
        player.animations.getAnimation('right').speed = playerSpeed * 1.75;
        player.animations.play('right');
        textEnd.alpha = 0;
        playing = true;
        updateTexts();
    }

    function updateTexts() {
        textSpeed.setText("Speed: " + (playerSpeed === 30 ? "max" : (playerSpeed * 10).toFixed(0)));
        textCoins.setText("Coins: " + coinsPicked + (playing ? "" : "/" + inGame.game.user.HighestCoins));
        textDistance.setText("Distance: " + (distance / 10).toFixed(0) + (playing ? "" : "/" + (inGame.game.user.HighestDistance / 10).toFixed(0)));
    }

    function moveHandler(pointer, x, y, onDown) {
        if (!playing) {
            if (onDown) {
                gameReset();
            }
            return;
        }

        targetX = pointer.worldX - 27;
        useTarget = true;

        if (onDown && player.body.touching.down) {
            player.body.velocity.y = -600;
            spawnCoin(700, inGame.rnd.between(100, 268));
            spawnEnemy(700 + inGame.rnd.between(0, playerSpeed), 230);
        }
    }

    function spawnCoin(x, y) {
        var coin = Coins.create(x, y, 'coin');
        coin.animations.add('rotation', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        coin.animations.play('rotation');
    }

    function spawnEnemy(x, y) {
        var enemy = enemies.create(x, y, 'enemy');
        enemy.animations.add('left', [0, 1, 2, 3], playerSpeed * 2, true);
        enemy.animations.play('left');
        enemy.body.setSize(30, 60, 0, 5);
    }

    return inGame;
};