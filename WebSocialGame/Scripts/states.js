/// <reference path="phaser.js" />

function mainMenu() {
    var mainMenu = new Phaser.State();

    mainMenu.create = function () {
        mainMenu.add.button(250, 130, 'play', playGame);
    }

    function playGame() {
        mainMenu.state.start('inGame');
    }

    return mainMenu;
}

function inGame() {
    var inGame = new Phaser.State();
    var player, enemies, ground, coins, backgrounds,
    playerSpeed, distance, coinsPicked,
    spacebar,
    textSpeed, textCoins, textDistance,
    playing;

    inGame.create = function () {

        backgrounds = inGame.add.group();
        backgrounds.create(0, 0, 'background');
        backgrounds.create(1355, 0, 'background');

        coins = inGame.add.group();
        coins.enableBody = true;

        enemies = inGame.add.group();
        enemies.enableBody = true;

        player = inGame.add.sprite(0, 160, 'player');
        inGame.physics.arcade.enable(player);
        player.body.gravity.y = 1200;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], playerSpeed * 2, true);

        ground = inGame.add.sprite(0, 300, 'ground');
        ground.alpha = 0.5;
        inGame.physics.arcade.enable(ground);
        ground.body.immovable = true;

        spacebar = inGame.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        textSpeed = inGame.add.text(5, 10);
        textCoins = inGame.add.text(5, 40);
        textDistance = inGame.add.text(5, 70);

        gameReset();
    };

    inGame.update = function () {
        if (!playing) return;

        distance += playerSpeed;

        inGame.physics.arcade.collide(ground, player);
        inGame.physics.arcade.collide(coins, player, coinPickup, null, this);
        inGame.physics.arcade.collide(enemies, player);

        backgrounds.forEach(backgroundScroll, this);
        coins.forEach(coinScroll, this);
        enemies.forEach(enemiesWalk, this);
        player.animations.getAnimation('right').speed = playerSpeed * 1.5;

        if (spacebar.isDown && player.body.touching.down) {
            player.body.velocity.y = -600;
            var coin = coins.create(700, inGame.rnd.between(0, 268), 'coin');
            coin.animations.add('rotation', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
            coin.animations.play('rotation');
            var enemy = enemies.create(700, 230, 'enemy');
            enemy.animations.add('left', [0, 1, 2, 3], 10, true);
            enemy.animations.play('left');
        }

        if (playerSpeed < 30) {
            playerSpeed += 0.0005;
        }

        updateTexts();
    };

    function backgroundScroll(background) {
        background.position.x -= playerSpeed;
        if (background.position.x <= -1355) {
            background.position.x += 1355*2;
        }
    }
    
    function coinScroll(coin){
        coin.body.velocity.x = playerSpeed*-100;
        if(coin.position.x < -1355){
            coin.kill();
        }
    }
    
    function enemiesWalk(enemy){
        enemy.body.velocity.x = playerSpeed*-125;
        if(enemy.position.x < -1355){
            enemy.kill();
        }
    }
    
    function coinPickup(player, coin){
        coin.kill();
        coinsPicked++;
    }

    function gameReset() {
        playerSpeed = 2;
        distance = coinsPicked = 0;
        player.animations.play('right');
        playing = true;
        updateTexts();
    }

    function updateTexts() {
        textSpeed.setText(playerSpeed.toFixed(1));
        textCoins.setText(coinsPicked);
        textDistance.setText(distance.toFixed(0));
    }

    return inGame;
}