"use strict";
const app = new PIXI.Application();

let stage;
let assets;

// sound variables
let miss, patronHit, sodaThrow, patronReach, lose, move, theme, money; 

// game over scene variables
let gameOverScene, playAgain, finalScore, gameOverText, wallDecorGameOver, floorDecorGameOver, sodaTippedGameOver;

// game scene variables
let wallDecorGame, footballFieldGame, floorDecorGame, scoreIndicator, livesIndicator, moneyDecor;
let gameScene, waiter, patron, soda, bigSoda, barStools, sodaCan, sodaTipped, wall, floor, field;

// start scene variables
let startScene, wallDecorTitle, floorDecorTitle, playIndicator, title, tutorialMessage, tip;

// scene alignment variables
let sceneHeight;
let sceneWidth;

// arrays for gameplay/decorations
let sodas = [];
let patrons = [];
let bars = [];
let moneys = [];
let bar;


// game loop variables
let newPatron, newMoney;
let score = 0;
let lives = 5;
let scale = 0;
let paused = true;
let timer = 0;
let player, playerPos;
let randVal = Math.floor(Math.random()*10);

loadImages()
async function loadImages(){
    // creation of all sprites
    PIXI.Assets.addBundle("sprites", {
        waiter: "images/waiter.png",
        soda: "images/soda.png",
        bigSoda: "images/soda-Big.png",
        barStools: "images/barStools.png",
        patron: "images/patron.png",
        field: "images/football.png",
        wall: "images/wall.png",
        floor: "images/floor.png",
        sodaTipped: "images/sodaTipped.png",
        moneyDecor:"images/money.png",
      });

    // loading sprites
      assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
      });
      setup();
}

async function setup(){

    // creation of PIXI canvas
    await app.init({ width: 700, height: 700, background: "#4694e8"});
    app.ticker.add(gameLoop);

    // alignment of canvas
    document.body.appendChild(app.canvas);
    document.body.style.textAlign = "center";

    // stage creation for different states
    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

    // creation of scenes for gameplay
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // sounds loaded
    miss = new Howl({
        src: ["sounds/miss.mp3"],
    });

    patronHit = new Howl({
        src: ["sounds/patronHit.mp3"],
    });

    patronReach = new Howl({
        src: ["sounds/patronReach.mp3"],
    });

    sodaThrow = new Howl({
        src:["sounds/sodaThrow.mp3"],
    });

    lose = new Howl({
        src:["sounds/lose.mp3"],
    })

    move = new Howl({
        src:["sounds/move.mp3"],
    })

    theme = new Howl({
        src:["sounds/theme.mp3"],
    })

    money = new Howl({
        src:["sounds/money.mp3"],
    })
    createAllLabels();
}

function createAllLabels(){
    lives = 5;
    score = 0;

    // adding decorations to every different scene first so they don't overlap
    // important gameplay information
    wallDecorTitle = new Decoration(assets.wall, 350,50)
    floorDecorTitle = new Decoration(assets.floor, 350, 450);
    startScene.addChild(wallDecorTitle);
    startScene.addChild(floorDecorTitle);   

    wallDecorGameOver = new Decoration(assets.wall, 350,50)
    floorDecorGameOver = new Decoration(assets.floor, 350, 450);
    sodaTippedGameOver = new Decoration(assets.sodaTipped, sceneWidth/2, sceneHeight/2);
    gameOverScene.addChild(wallDecorGameOver);
    gameOverScene.addChild(floorDecorGameOver);
    gameOverScene.addChild(sodaTippedGameOver);

    wallDecorGame = new Decoration(assets.wall, 350,50)
    footballFieldGame = new Decoration(assets.field, 550, 50);
    floorDecorGame = new Decoration(assets.floor, 350, 450);
    gameScene.addChild(floorDecorGame);
    gameScene.addChild(wallDecorGame);
    gameScene.addChild(footballFieldGame);

    // loop for less redundant code
    for(let i = 0; i<4; i++){
        bar = new Decoration(assets.barStools, 320, 200 + (100*i));
        bars.push(bar);
        gameScene.addChild(bars[i]);
    }

    // Starting Scene additions
    title = new PIXI.Text("Soda Popper!", {
        fill: "#fc9003",
        fontSize: 96,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3,
    });
    title.x = 50;
    title.y = 20;

    startScene.addChild(title);
    sodaCan = new Decoration(assets.bigSoda, sceneWidth/2, sceneHeight/2);
    startScene.addChild(sodaCan);

    playIndicator = new PIXI.Text("Press M1 to Play!", {
        fill: "#fc9003",
        fontSize: 70,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    playIndicator.y = 600;
    playIndicator.x = 80;

    startScene.addChild(playIndicator);

    tutorialMessage = new PIXI.Text("\t\t\t\t\t\t\t\tHow To Play: Use M1 to slide sodas to patrons,\nW/S to move up/down the bars and a to go through them", {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tutorialMessage.x = 40;
    tutorialMessage.y = 130;

    startScene.addChild(tutorialMessage);
    
    tip = new PIXI.Text("Tip: Don't serve too many cans, you'll lose lives!\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCollect cash for more score!"
        , {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tip.x = 85;
    tip.y = 530;

    startScene.addChild(tip);

    // creation of player for game scene and other game scene text
    player = new Waiter(assets.waiter);
    gameScene.addChild(player);
    player.x = 660;
    player.y = 170;
    
    scoreIndicator = new PIXI.Text(`Score: ${score}` ,{
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    scoreIndicator.x = sceneWidth/2 - 50;
    scoreIndicator.y = 10;
    gameScene.addChild(scoreIndicator);

    livesIndicator = new PIXI.Text(`Lives: ${lives}`, {
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    livesIndicator.x = 10;
    livesIndicator.y = 10;

    gameScene.addChild(livesIndicator);

    // game over scene text additions
    gameOverText = new PIXI.Text(`Game Over!`, {
        fill: "#fc9003",
        fontSize: 96,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, });
    gameOverScene.addChild(gameOverText);
    gameOverText.x = 100;
    gameOverText.y = 20;

    finalScore = new PIXI.Text("",{
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    gameOverScene.addChild(finalScore);
    finalScore.x = 250;
    finalScore.y = 150;

    playAgain = new PIXI.Text(`Press M1 to continue!`, {
        fill: "#fc9003",
        fontSize: 60,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    gameOverScene.addChild(playAgain);
    playAgain.y = 560;
    playAgain.x = 70;

    // function for initializing gameplay
    app.view.onclick = function(e){
        move.play();
        theme.play();
        startScene.visible = false;
        gameScene.visible = true;
        paused = false;
    };   
    
}

function gameLoop(){
    // don't tick if paused
    if(paused){
        return;
    }
    // variable for spawning patrons
    timer += 1;

    // fps
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    // setting events
    app.view.onclick = launchSoda;
    window.addEventListener("keydown", movePlayer);
    
    // moves sodas / patrons
    for (let s of sodas) {
        s.move(dt);
    }

    for (let p of patrons){
        p.move(dt);
    }

    if(player.x < 640){
        app.view.onclick = null;
    }

    // collision handling
    for (let p of patrons){

        // patrons pass the player
        if (p.x >= 610){
            patrons.forEach((b) => gameScene.removeChild(b));
            patrons = [];
            scale = 0;
            timer = 0;
            patronReach.play();
            decreaseLifeBy(1);
        }

        // sodas hitting / missing 
        for (let s of sodas){
            if (s.x < 10){
                gameScene.removeChild(s);
                s.isAlive = false;
                miss.play();
                decreaseLifeBy(1);
            }
            if (rectsIntersect(p,s)){
                if(getRandomInt(0,10) <= 2){
                    newMoney = new Money(assets.moneyDecor, p.x, p.y+40);
                    moneys.push(newMoney);
                    gameScene.addChild(newMoney);
                }

                gameScene.removeChild(s);
                gameScene.removeChild(p);
                s.isAlive = false;
                p.isAlive = false;

                patronHit.play();
                increaseScoreBy(30);

            }
            // filtering out useless variables 
            sodas = sodas.filter((s) => s.isAlive);
            patrons = patrons.filter((p) => p.isAlive);
        }
    }

    for(let m of moneys){
        if(rectsIntersect(player, m)){
            money.play();
            m.isAlive = false
            gameScene.removeChild(m);
            increaseScoreBy(50)
        }
        moneys = moneys.filter((m) => m.isAlive);
    }

    // respawning patrons
    if (patrons.length <= 0 || timer % 800 == 0){
        for(let i=0;i<4;i++){
            timer = 0;
            newPatron = new Patron(assets.patron, 100, 123);
            newPatron.y += 100*i;
            patrons.push(newPatron);
            gameScene.addChild(newPatron);
        }
    }

    // losing if you have no lives left
    if(lives <= 0){
        paused = true;
        gameScene.visible = false;
        gameOverScene.visible = true;
        end();
        return;
    }

}

// throwing a soda from the player's position
function launchSoda(){
    let thrownSoda = new Soda(assets.soda, player.x, player.y-20);
    sodas.push(thrownSoda);
    gameScene.addChild(thrownSoda);
    sodaThrow.play();
}

// move player up/down the bars
function movePlayer(e){
    if(e.key == "w"){
        move.play();
        player.y -= 100;
        player.x = 660;
    }
    if(e.key == "s"){
        move.play();
        player.y += 100;
        player.x = 660
    }
    if (e.key == "a"){
        player.move();
    }

    if (player.y > 470){
        player.y= 170;
    }
    if (player.y <170){
        player.y = 470;
    }

    if (player.x < 30){
        player.x = 660;
    }
}
// increase score when patron is hit
function increaseScoreBy(inc){
    score += inc;
    scoreIndicator.text = `Score: ${score}`;
}

// decrease life when hit/miss can
function decreaseLifeBy(dec){
    lives -= dec;
    livesIndicator.text = `Lives: ${lives}`;
}

// end function when you lose and want to restart
function end(){
    theme.stop();
    lose.play();
    paused = true;

    // resetting values + adding final score display
    window.onkeydown = null;
    app.view.onclick = null;
    lives = 5;
    scale = 0;
    finalScore.text = `Final Score: ${score}`;

    // clearing all arrays for re-instantiation
    sodas.forEach((c) => gameScene.removeChild(c));
    sodas = [];

    patrons.forEach((b) => gameScene.removeChild(b));
    patrons = [];

    bars.forEach((c) => gameScene.removeChild(c));
    bars = [];

    gameScene.visible = false;
    gameOverScene.visible = true;

    // reassigning function to switch game states
    app.view.onclick = function(e){
        gameOverScene.visible = false;
        startScene.visible = true;
        finalScore.text = "";
        move.play();
        createAllLabels();
    }
}

// helper method for collision
function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
 // helper method for getting random number
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
