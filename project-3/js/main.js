"use strict";
const app = new PIXI.Application();

let stage;
let assets;

let startScene;
let gameScene, waiter, patron, soda, bigSoda, barStools, tossSound, drinkSound, crashSound;
let gameOverScene;
let tutorialScene;
let player;

let scoreIndicator;
let livesIndicator;

let sceneHeight;
let sceneWidth;
let sodas = [];
let patrons = [];
let newPatron
let score;
let lives;

let playerPos;

loadImages()
async function loadImages(){
    PIXI.Assets.addBundle("sprites", {
        waiter: "images/waiter.png",
        soda: "images/soda.png",
        bigSoda: "images/soda-Big.png",
        barStools: "images/barStools.png",
        patron: "images/patron.png",
      });

      assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
      });
      setup();
}
async function setup(){

    await app.init({ width: 700, height: 700, background: "#4694e8"});

    document.body.appendChild(app.canvas);
    document.body.style.textAlign = "center";
    score = 0;
    lives = 5;

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
    // Starting Scene additions
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
    sodaCan.y = 180;

    startScene.addChild(sodaCan);

    let playIndicator = new PIXI.Text("Press M1 to Play!", {
        fill: "#fc9003",
        fontSize: 70,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    playIndicator.y = 580;
    playIndicator.x = 80;

    startScene.addChild(playIndicator);

    let tutorialMessage = new PIXI.Text("How To Play: Use M1 to slide sodas to patrons,\n\t\t\t\t\t\t\t\t\t\t\t\t\tany key to move down the bars", {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tutorialMessage.x = 70;
    tutorialMessage.y = 130;

    startScene.addChild(tutorialMessage);
    
    let tip = new PIXI.Text("Tip: Don't serve too many cans, you'll lose lives!", {
        fill: "#fc9003",
        fontSize: 25,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    tip.x = 70;
    tip.y = 500;

    startScene.addChild(tip);



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

    let bar1, bar2, bar3, bar4;
    bar1 = PIXI.Sprite.from(assets.barStools);
    bar2 = PIXI.Sprite.from(assets.barStools);
    bar3 = PIXI.Sprite.from(assets.barStools);
    bar4 = PIXI.Sprite.from(assets.barStools);

    gameScene.addChild(bar1);
    gameScene.addChild(bar2);
    gameScene.addChild(bar3);
    gameScene.addChild(bar4);

    bar1.x = 20;
    bar1.y = 150;
    bar2.x = 20;
    bar2.y = 250;
    bar3.x = 20;
    bar3.y = 350;
    bar4.x = 20;
    bar4.y = 450;

    scoreIndicator = new PIXI.Text(`Score: ${score}` ,{
        fill: "#fc9003",
        fontSize: 30,
        fontFamily: "Arial",
        stroke: 0xffffff,
        strokeThickness: 3, 
    });
    scoreIndicator.x = sceneHeight/2;
    scoreIndicator.y = 10;
    player = new Waiter(assets.waiter);
    gameScene.addChild(player);
    player.x = 660;
    player.y = 170;



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
    window.onkeydown = movePlayer;

    
    for (let s of sodas) {
        s.move(dt);
      }


    for (let p of patrons){
        p.move(dt);
    }

    for (let p of patrons){
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
        for(let i=0;i<4;i++){
            newPatron = new Patron(assets.patron, 100, 130);
            newPatron.y += 100*i;
            patrons.push(newPatron);
            gameScene.addChild(newPatron);
        }
    }

}

function launchSoda(){
    let thrownSoda = new Soda(assets.soda, player.x, player.y-20);
    sodas.push(thrownSoda);
    gameScene.addChild(thrownSoda);
}
function movePlayer(){
    console.log(window.onkeydown.key);
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

// helper method

function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
