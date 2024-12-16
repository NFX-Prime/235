"use strict";
const app = new PIXI.Application();

let stage;
let assets;

let startScene;
let gameScene, waiter, patron, soda, bigSoda, barStools, sodaCan, sodaTipped, wall, floor, field;

// sound variables
let miss, patronHit, sodaThrow, patronReach, start, lose, move; 
let gameOverScene;
let player;
let playAgain, finalScore, gameOverText;
let wallDecorGame, footballFieldGame, floorDecorGame;
let wallDecorTitle, floorDecorTitle;
let wallDecorGameOver, floorDecorGameOver, sodaTippedGameOver;
let playIndicator, title, tutorialMessage, tip
let scoreIndicator;
let livesIndicator;

let sceneHeight;
let sceneWidth;
// arrays for gameplay/decorations
let sodas = [];
let patrons = [];
let bars = [];
let bar;
let newPatron
let score = 0;
let lives = 5;
let scale = 0;
let paused = true;
let timer = 0;

let playerPos;

loadImages()
async function loadImages(){
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
      });

      assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
      });
      setup();
}
async function setup(){

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

    // sounds (to be loaded)

    start = new Howl({
        src: ["sounds/start.mp3"],
    });

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

    createAllLabels();

}

function createAllLabels(){
    lives = 5;
    score = 0;

    wallDecorTitle = new Decoration(assets.wall, 350,50)
    floorDecorTitle = new Decoration(assets.floor, 350, 450);
    startScene.addChild(wallDecorTitle);
    startScene.addChild(floorDecorTitle);   

    wallDecorGameOver = new Decoration(assets.wall, 350,50)
    floorDecorGameOver = new Decoration(assets.floor, 350, 450);
    gameOverScene.addChild(wallDecorGameOver);
    gameOverScene.addChild(floorDecorGameOver);   

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
    playIndicator.y = 580;
    playIndicator.x = 80;

    startScene.addChild(playIndicator);

    tutorialMessage = new PIXI.Text("How To Play: Use M1 to slide sodas to patrons,\n\t\t\t\t\t\t\t\t\t\t\t\t\tany key to move down the bars", {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tutorialMessage.x = 70;
    tutorialMessage.y = 130;

    startScene.addChild(tutorialMessage);
    
    tip = new PIXI.Text("Tip: Don't serve too many cans, you'll lose lives!", {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tip.x = 85;
    tip.y = 530;

    startScene.addChild(tip);

    wallDecorGame = new Decoration(assets.wall, 350,50)
    footballFieldGame = new Decoration(assets.field, 550, 50);
    floorDecorGame = new Decoration(assets.floor, 350, 450);
    gameScene.addChild(floorDecorGame);
    gameScene.addChild(wallDecorGame);
    gameScene.addChild(footballFieldGame);

    player = new Waiter(assets.waiter);
    gameScene.addChild(player);
    player.x = 660;
    player.y = 170;
    

    for(let i = 0; i<4; i++){
        bar = new Decoration(assets.barStools, 320, 200 + (100*i));
        bars.push(bar);
        gameScene.addChild(bars[i]);
    }

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

    sodaTippedGameOver = new Decoration(assets.sodaTipped, sceneWidth/2, sceneHeight/2);
    gameOverScene.addChild(sodaTippedGameOver);

    app.view.onclick = function(e){
        start.play();
        startScene.visible = false;
        gameScene.visible = true;
        paused = false;
    };   
    
}

function gameLoop(){
    if(paused){
        return;
    }
    timer += 1;

    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    app.view.onclick = launchSoda;
    window.onkeydown = movePlayer;
    
    for (let s of sodas) {
        s.move(dt);
      }


    for (let p of patrons){
        p.move(dt);
    }

    for (let p of patrons){
        if (p.x >= player.x){
            patrons.forEach((b) => gameScene.removeChild(b));
            patrons = [];
            scale = 0;
            timer = 0;
            patronReach.play();
            decreaseLifeBy(1);
        }
        for (let s of sodas){
            if (s.x < 10){
                gameScene.removeChild(s);
                s.isAlive = false;
                miss.play();
                decreaseLifeBy(1);
            }
            if (rectsIntersect(p,s)){
                gameScene.removeChild(s);
                gameScene.removeChild(p);
                s.isAlive = false;
                p.isAlive = false;
                patronHit.play();
                increaseScoreBy(30);
            }
            sodas = sodas.filter((s) => s.isAlive);
            patrons = patrons.filter((p) => p.isAlive);
        }
    }
    if (patrons.length <= 0 || timer % 800 == 0){

        for(let i=0;i<4;i++){
            timer = 0;
            newPatron = new Patron(assets.patron, 100, 123);
            newPatron.y += 100*i;
            patrons.push(newPatron);
            gameScene.addChild(newPatron);
        }
    }

    if(lives <= 0){
        paused = true;
        gameScene.visible = false;
        gameOverScene.visible = true;
        end();
        return;
    }

}

function launchSoda(){
    let thrownSoda = new Soda(assets.soda, player.x, player.y-20);
    sodas.push(thrownSoda);
    gameScene.addChild(thrownSoda);
    sodaThrow.play();
}
function movePlayer(e){
    player.y += 100;
    move.play();
    if (player.y > 470){
        player.y= 170;
    }
}

function increaseScoreBy(inc){
    score += inc;
    scoreIndicator.text = `Score: ${score}`;
}

function decreaseLifeBy(dec){
    lives -= dec;
    livesIndicator.text = `Lives: ${lives}`;
}

// function TBM, object w/ time passed to limit number of cans thrown
function refill(){

}

function end(){
    lose.play();
    paused = true;

    window.onkeydown = null;
    app.view.onclick = null;
    lives = 5;
    scale = 0;
    finalScore.text = `Final Score: ${score}`;

    sodas.forEach((c) => gameScene.removeChild(c));
    sodas = [];

    patrons.forEach((b) => gameScene.removeChild(b));
    patrons = [];

    bars.forEach((c) => gameScene.removeChild(c));
    bars = [];

    gameScene.visible = false;
    gameOverScene.visible = true;
    app.view.onclick = function(e){
        gameOverScene.visible = false;
        startScene.visible = true;
        finalScore.text = "";
        createAllLabels();
    }
}
// helper method

function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
