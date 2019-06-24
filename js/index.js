"use strict";
const images = {
    tunnel: new Image(),
    pillar: {
        center: new Image,
        top: new Image,
        foot: new Image
    }
};
images.pillar.center.src = "images/pillar/center.png";
images.pillar.top.src = "images/pillar/top.png";
images.pillar.foot.src = "images/pillar/foot.png";
class Bird extends FlappyElement {
    constructor() {
        super();
        let timestamp = performance.now();
        const flight = {
            timestamp: 0,
            y: 0,
            held: false
        };
        const onload = () => {
            let r = Bird.sprite.width / Bird.sprite.height;
            this.height = 40;
            this.width = this.height * r;
        };
        if (!Bird.sprite || !Bird.sprite.complete) {
            if (!Bird.sprite)
                Bird.sprite = new Image();
            Bird.sprite.src = "images/flappy.png";
            Bird.sprite.onload = onload;
        }
        if (Bird.sprite.complete) {
            onload();
        }
        extend_method(this, "update", (new_timestamp) => {
            const elapsed = new_timestamp - timestamp;
            const g = elapsed * 0.07;
            this.speed.y = Math.min(this.speed.y + g, 15);
            if ((timestamp - flight.timestamp) > 150 && flight.held) {
                this.speed.y = -15;
                this.rotation = -30;
                flight.y = this.y;
                flight.timestamp = new_timestamp;
            }
            // this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
            if (this.y > flight.y)
                this.rotation = Math.min(90, this.rotation + (this.rotation + 120) / 20);
            timestamp = new_timestamp;
        });
        this.render = () => {
            ctx.save();
            this.apply_transform();
            ctx.drawImage(Bird.sprite, 0, 0, this.width, this.height);
            ctx.restore();
        };
        this.set_flying = (value) => { flight.held = value; };
        document.addEventListener("keydown", (ev) => {
            let prevent_default = true;
            switch (ev.key) {
                case " ":
                    this.set_flying(true);
                    break;
                default:
                    prevent_default = false;
                    break;
            }
            if (prevent_default)
                ev.preventDefault();
        });
        document.addEventListener("keyup", (ev) => {
            switch (ev.key) {
                case " ":
                    this.set_flying(false);
                    break;
                default:
                    break;
            }
        });
    }
}
class Pillar extends FlappyElement {
    constructor() {
        super();
        const sprites = images.pillar;
        const base_width = this.width = Math.max(sprites.center.width, sprites.top.width, sprites.foot.width);
        Object.defineProperties(this, {
            hitboxes: {
                get: () => {
                    return [
                        {
                            x: this.x,
                            y: this.y,
                            width: this.width,
                            height: images.pillar.top.height
                        },
                        {
                            x: this.x + (this.width - images.pillar.center.width) / 2,
                            y: this.y + images.pillar.top.height,
                            width: images.pillar.center.width,
                            height: this.height - (images.pillar.foot.height + images.pillar.top.height)
                        },
                        {
                            x: this.x,
                            y: this.y + this.height - images.pillar.foot.height,
                            width: this.width,
                            height: images.pillar.foot.height
                        }
                    ];
                }
            }
        });
        this.render = () => {
            ctx.save();
            this.apply_transform();
            const scale_x = this.width / base_width;
            const sizes = {
                top: sprites.top.width * scale_x,
                center: sprites.center.width * scale_x,
                foot: sprites.foot.width * scale_x
            };
            ctx.translate(this.width / 2, 0);
            ctx.drawImage(sprites.foot, -sizes.foot / 2, this.height - sprites.foot.height, sizes.foot, sprites.foot.height);
            ctx.drawImage(sprites.center, -sizes.center / 2, sprites.top.height, sizes.center, this.height - (sprites.foot.height + sprites.top.height));
            ctx.drawImage(sprites.top, -sizes.top / 2, 0, sizes.top, sprites.top.height);
            ctx.restore();
        };
    }
}
class Tunnel extends FlappyElement {
    constructor() {
        super();
        this.height = canvas.height;
        const pad = 120;
        this.passage = {};
        this.passage.length = Math.min(200 + Math.random() * 100, this.height - 2 * pad);
        this.passage.position = pad + Math.random() * (this.height - pad * 2 - this.passage.length) + this.passage.length / 2;
        this.render = () => {
            ctx.save();
            this.apply_transform();
            pillars.top.render();
            pillars.bottom.render();
            ctx.restore();
        };
        extend_method(this, "update", (time) => {
            pillars.top.height = this.passage.top;
            pillars.bottom.y = this.passage.bottom;
            pillars.bottom.height = this.height - this.passage.bottom;
        }, "after");
        const pillars = {
            top: new Pillar(),
            bottom: new Pillar()
        };
        pillars.top.y = 0;
        pillars.top.rotation = 180;
        this.width = pillars.top.width;
        Object.defineProperties(this.passage, {
            top: { get: () => this.passage.position - this.passage.length / 2 },
            bottom: { get: () => this.passage.position + this.passage.length / 2 }
        });
        Object.defineProperties(this, {
            hitboxes: {
                get: () => {
                    let boxes = [...pillars.top.hitboxes, ...pillars.bottom.hitboxes];
                    for (let box of boxes) {
                        box.x += this.x;
                        box.y += this.y;
                    }
                    // boxes[0] = this.bounds;
                    // boxes[1] = this.bounds;
                    // boxes[0].height = this.passage.top;
                    // boxes[1].y = this.passage.bottom;
                    // boxes[1].height = this.height - this.passage.bottom;
                    return boxes;
                }
            }
        });
    }
}
class Bot {
    constructor(bird) {
        this.update = () => {
            if (tunnels.length > 0) {
                if (bird.y + bird.height + bird.speed.y * 2 >= tunnels[0].passage.bottom) {
                    bird.set_flying(true);
                }
                else {
                    bird.set_flying(false);
                }
            }
        };
        document.addEventListener("keydown", () => {
            this.update = () => { };
        });
    }
}
const bird = new Bird();
let tunnels = [];
let update_id = null;
const bot = new Bot(bird);
const background = new Background();
const update = (time) => {
    update_id = requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.update(time);
    background.render();
    bot.update();
    bird.update(time);
    bird.render();
    // pillar.render();
    // draw(pillar, pillar.render.bind(pillar));
    while (!tunnels.length || tunnels[tunnels.length - 1].x < canvas.width) {
        const last = tunnels[tunnels.length - 1];
        const tunnel = new Tunnel();
        const x = last ? last.x + last.width : canvas.width / 2;
        tunnel.x = x + Math.random() * 500 + 300;
        tunnel.speed.x = -5;
        tunnels.push(tunnel);
    }
    {
        let i = 0;
        while (tunnels[i].x + tunnels[i].width < 0)
            i++;
        tunnels.splice(0, i);
    }
    for (let tunnel of tunnels) {
        tunnel.update(time);
        tunnel.render();
        if (bird.collide_with(tunnel) || bird.y + bird.height >= canvas.height) {
            cancelAnimationFrame(update_id);
        }
        ctx.fillStyle = "gray";
        // for (let box of tunnel.hitboxes)
        //     ctx.fillRect(box.x, box.y, box.width, box.height);
    }
};
update_id = requestAnimationFrame(update);
canvas.focus();
