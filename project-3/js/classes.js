class Waiter extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(1);
        this.x = x;
        this.y = y;

        this.fwd = {x:-1, y:0};
        this.speed = 400;
    }
    move(dt = 1/60){
        this.x += this.fwd.x *this.speed *dt;
        this.y += this.fwd.y *this.speed *dt;
    }
}

class Decoration extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
    }
}

class Soda extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(1);
        this.x = x;
        this.y = y;

        this.fwd = {x:-1, y:0};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }
    move(dt = 1/60){
        this.x += this.fwd.x *this.speed *dt;
        this.y += this.fwd.y *this.speed *dt;
    }

}
class Patron extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(0.5);
        this.x = x;
        this.y = y;

        this.fwd = {x:2 , y:0};
        this.speed = 10;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt = 1/60){
        this.x += this.fwd.x *this.speed *dt;
        this.y += this.fwd.y *this.speed *dt;
    }
}

class Money extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
        this.isAlive = true;
        Object.seal(this);
    }
}