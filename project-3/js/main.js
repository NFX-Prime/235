"use strict";
const app = new PIXI.Application();

let stage;
let assets;

let startScene;
let gameScene, waiter, patron, soda, bigSoda, barStools, wall, floor, field, tossSound, drinkSound, crashSound;
let bar1, bar2, bar3, bar4;
let gameOverScene;
let tutorialScene;
let player;
let playAgain, finalScore, gameOverText;
let wallDecor, footballField, floorDecor;
let playIndicator, title, tutorialMessage, tip
let scoreIndicator;
let livesIndicator;

let sceneHeight;
let sceneWidth;
let sodas = [];
let patrons = [];
let bars = [];
let bar;
let newPatron
let score = 0;
let lives = 5;
let scale = 0;
let paused = true;

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
      });

      assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
      });
      setup();
}
async function setup(){

    await app.init({ width: 700, height: 700, background: "#4694e8"});
    app.ticker.add(gameLoop);

    document.body.appendChild(app.canvas);
    document.body.style.textAlign = "center";

    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

    startScene = new PIXI.Container();
    stage.addChild(startScene);

    tutorialScene = new PIXI.Container();
    tutorialScene.visible = false;
    stage.addChild(tutorialScene);


    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // sounds (to be loaded)

    createAllLabels();

}

function createAllLabels(){
    lives = 5;
    score = 0;

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
    const sodaCan = PIXI.Sprite.from("images/soda-Big.png");
    sodaCan.x = sceneWidth/2 - 150;
    sodaCan.y = 180;

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
    tip.x = 70;
    tip.y = 500;

    startScene.addChild(tip);

    wallDecor = new Decoration(assets.wall, 350,50)
    footballField = new Decoration(assets.field, 550, 50);
    floorDecor = new Decoration(assets.floor, 350, 450);
    gameScene.addChild(floorDecor);
    gameScene.addChild(wallDecor);
    gameScene.addChild(footballField);

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
    playAgain.y = 580;
    playAgain.x = 30;

    app.view.onclick = function(e){
        startScene.visible = false;
        gameScene.visible = true;
        paused = false;
    };   
}

function gameLoop(){
    if(paused){
        return;
    }

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
            decreaseLifeBy(1);
        }
        for (let s of sodas){
            if (s.x < 10){
                gameScene.removeChild(s);
                s.isAlive = false;
                decreaseLifeBy(1);
            }
            if (rectsIntersect(p,s)){
                gameScene.removeChild(s);
                gameScene.removeChild(p);
                s.isAlive = false;
                p.isAlive = false;
                increaseScoreBy(30);
                

            }
            sodas = sodas.filter((s) => s.isAlive);
            patrons = patrons.filter((p) => p.isAlive);
        }
    }
    if (patrons.length <= 0){
        scale += 1;
        for(let i=0;i<4;i++){
            newPatron = new Patron(assets.patron, 100, 123);
            newPatron.y += 100*i;
            newPatron.speed *= (1.2*scale);
            patrons.push(newPatron);
            gameScene.addChild(newPatron);
        }
        console.log(scale);
        
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
}
function movePlayer(){
    player.y += 100;
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
