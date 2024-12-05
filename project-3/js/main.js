"use strict";
const app = new PIXI.Application();

let stage;
let assets;

let startScene;
let gameScene, waiter, patron, soda, bigSoda, barStools, tossSound, drinkSound, crashSound;
let gameOverScene;
let player;

let sceneHeight;
let sceneWidth;
let sodas = [];
let patrons = [];

let playerPos;

loadImages()
async function loadImages(){
    PIXI.Assets.addBundle("sprites", {
        waiter: "images/waiter_placeholder.png",
        soda: "images/soda.png",
        bigSoda: "images/soda-Big.png",
        barStools: "images/barStools.png",
        patron: "images/patron_placeholder.png",
      });

      assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
      });
      setup();
}
async function setup(){

    await app.init({ width: 700, height: 700});

    document.body.appendChild(app.canvas);

    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

    startScene = new PIXI.Container();
    stage.addChild(startScene);

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
    let title = new PIXI.Text("Soda Popper!", {
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
    sodaCan.y = 150;

    startScene.addChild(sodaCan);

    let playIndicator = new PIXI.Text("Press M1\n  to Play!", {
        fill: "#fc9003",
        fontSize: 96,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    playIndicator.y = 450;
    playIndicator.x = 135;

    startScene.addChild(playIndicator);

    let livesIndicator = new PIXI.Text("Lives: 3", {
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    livesIndicator.x = 10;
    livesIndicator.y = 10;

    gameScene.addChild(livesIndicator);

    let scoreIndicator = new PIXI.Text("Score: 0",{
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    scoreIndicator.x = 570;
    scoreIndicator.y = 10;
    player = new Waiter(assets.waiter);
    gameScene.addChild(player);
    player.x = 600;
    player.y = 150;

    let bar1, bar2, bar3, bar4;
    bar1 = PIXI.Sprite.from("images/barStools.png");
    bar2 = PIXI.Sprite.from("images/barStools.png");
    bar3 = PIXI.Sprite.from("images/barStools.png");
    bar4 = PIXI.Sprite.from("images/barStools.png");

    gameScene.addChild(bar1);
    gameScene.addChild(bar2);
    gameScene.addChild(bar3);
    gameScene.addChild(bar4);

    bar1.x = 200;
    bar1.y = 150;

    bar2.x = 200;
    bar2.y = 250;

    bar3.x = 200;
    bar3.y = 350;

    bar4.x = 200;
    bar4.y = 450;


    gameScene.addChild(scoreIndicator);
    app.view.onclick = function(e){
        startScene.visible = false;
        gameScene.visible = true;
        app.ticker.add(gameLoop);
    };   
}
function gameLoop(){
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    app.view.onclick = launchSoda;
    for (let s of sodas) {
        s.move(dt);
      }

}
function launchSoda(){

    let thrownSoda = new Soda(assets.soda, player.x, player.y);
    sodas.push(thrownSoda);
    console.log(sodas);
    gameScene.addChild(thrownSoda);
}
