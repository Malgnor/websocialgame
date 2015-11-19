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
        player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], playerSpeed * 1.75, true);

        ground = inGame.add.sprite(0, 300, 'ground');
        ground.alpha = 0.5;
        inGame.physics.arcade.enable(ground);
        ground.body.immovable = true;

        spacebar = inGame.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        textSpeed = inGame.add.text(5, 10);
        textCoins = inGame.add.text(5, 35);
        textDistance = inGame.add.text(5, 60);
        textSpeed.stroke = textCoins.stroke = textDistance.stroke = 'white';
        textSpeed.strokeThickness = textCoins.strokeThickness = textDistance.strokeThickness = 2;
        textSpeed.fill = textCoins.fill = textDistance.fill = 'black';
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

        player.animations.getAnimation('right').speed = playerSpeed * 1.75;

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

    function killEach(child) {
        child.kill();
    }
    
    function coinPickup(player, coin){
        coin.kill();
        coinsPicked++;
    }

    function endGame(player, enemy) {
        player.animations.stop();
        spacebar.onDown.addOnce(gameReset);
        playing = false;
    }

    function gameReset() {
        coins.forEach(killEach, this);
        enemies.forEach(killEach, this);
        playerSpeed = 2;
        distance = coinsPicked = 0;
        player.animations.play('right');
        playing = true;
        updateTexts();
    }

    function updateTexts() {
        textSpeed.setText("Speed: " + playerSpeed.toFixed(1));
        textCoins.setText("Coins: " + coinsPicked);
        textDistance.setText("Distance: " + distance.toFixed(0));
    }

    return inGame;
}