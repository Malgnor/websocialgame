/// <reference path="phaser.js" />



function mainMenu() {
    var mainMenu = new Phaser.State();
    var textHighDistance, textCoins, textName;

    mainMenu.create = function () {
        mainMenu.add.sprite(0, 0, 'background');
        mainMenu.add.button(250, 130, 'play', playGame);
        //mainMenu.add.button(490, 323, 'compartilhar', compartilhar);
        //mainMenu.add.button(0, 296, 'curta', curtir);
        mainMenu.add.button(210, 284, 'invite', desafiar);

        textName = mainMenu.add.text(5, 10, mainMenu.game.user.name);
        textCoins = mainMenu.add.text(5, 40, "Coins: " + mainMenu.game.user.coins);
        textHighDistance = mainMenu.add.text(5, 70, "Highest distance: " + (mainMenu.game.user.highestDistance / 10).toFixed(0));
        textCoins.fill = textName.fill = textHighDistance.fill = 'white';

        // INICIALIZA O FACEBOOK -----------------------------------------------
        window.fbAsyncInit = function () {
            FB.init({
                appId: '735977296534812',
                xfbml: true,
                version: 'v2.5'
            });
            FB.getLoginStatus(function (res) {
                if (res.status === 'connected') {
                    mainMenu.game.user.fBID = res.authResponse.userID;
                    mainMenu.game.user.load();
                    console.log(res);
                    console.log(mainMenu.game.user);
                }
                else {
                    FB.login(function (res) {
                        if (res.authResponse) {
                            mainMenu.game.user.fBID = res.authResponse.userID;
                            mainMenu.game.user.load();
                            console.log(res);
                            console.log(mainMenu.game.user);
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

    /* -------------------------------------------------------------------------------*/

    function playGame() {
        mainMenu.state.start('inGame');
    }

    return mainMenu;
}

function inGame() {
    var inGame = new Phaser.State();
    var player, enemies, ground, coins, backgrounds,
    playerSpeed, distance, coinsPicked,
    escapeKey, spacebarKey, leftKey, rightKey, upKey, aKey, dKey, wKey,
    textSpeed, textCoins, textDistance, textEnd,
    playing, targetX, useTarget;

    inGame.create = function () {

        backgrounds = inGame.add.group();
        backgrounds.create(0, 0, 'background');
        backgrounds.create(1355, 0, 'background');

        coins = inGame.add.group();
        coins.enableBody = true;

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

        inGame.physics.arcade.overlap(coins, player, coinPickup, null, this);
        inGame.physics.arcade.overlap(enemies, player, endGame, null, this);

        backgrounds.forEach(backgroundScroll, this);
        coins.forEach(coinScroll, this);
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
        // coins.forEach(debugDraw, this);
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
        console.log("EndGame");
        inGame.game.user.save();
        updateTexts();
        playing = false;
    }

    function gameReset() {
        coins.forEach(killEach, this);
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
        textCoins.setText("Coins: " + coinsPicked + (playing ? "" : "/" + inGame.game.user.highestCoins));
        textDistance.setText("Distance: " + (distance / 10).toFixed(0) + (playing ? "" : "/" + (inGame.game.user.highestDistance / 10).toFixed(0)));
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
        var coin = coins.create(x, y, 'coin');
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
}