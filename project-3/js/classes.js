class Waiter extends PIXI.Sprite{
    constructor(texture, x = 0, y = 0){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(3);
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
        this.scale.set(1);
        this.x = x;
        this.y = y;

        this.fwd = {x:1, y:0};
        this.speed = 100;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt = 1/60){
        this.x += this.fwd.x *this.speed *dt;
        this.y += this.fwd.y *this.speed *dt;
    }
}