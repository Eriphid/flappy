import assets from "./assets.js";
import FlappyElement from "./element.js";
import World from "./world.js";

class RepeatedImage extends FlappyElement{
    offset = {
        x: 0,
        y: 0
    }

    constructor(world: World)
    {
        super();
    }
}
export class EndlessScroll extends FlappyElement {
    scrollspeed = {
        x: 0,
        y: 0
    }

    constructor(world: World) {
        super();

        let scale = 1;
        let offset = {
            x: 0,
            y: 0
        };
        let timestamp: DOMHighResTimeStamp;
        

        
        
        assets.images.get("/images/background.png").then(image => {
            timestamp = performance.now();
            
            this.update = (new_timestamp: DOMHighResTimeStamp) => {
                scale = this.height / image.height;
                const elapsed = new_timestamp - timestamp;
                const end = {} as { x: number, y: number };
                end.x = offset.x + image.width;
                end.y = offset.y + image.height;
                if (end.x < 0) {
                    offset.x = end.x;
                }
                if (end.y < 0)
                    offset.y = end.y;
                timestamp = new_timestamp;
            }

            this._render = (ctx) => {
                ctx.imageSmoothingEnabled = false;

                ctx.drawImage(image, -offset.x, -offset.y, this.width / scale, this.height / scale, 0, 0, this.width, this.height);
                let x = offset.x ? offset.x + image.width : 0;
                let y = offset.y ? offset.y + image.height : 0;

                while (y < this.height / scale) {
                    while (x < this.width / scale) {
                        ctx.drawImage(image, 0, 0, this.width / scale, this.height / scale, x * scale, y * scale, this.width, this.height);
                        x += image.width;
                    }
                    y += image.height;
                }
            }
        })
    }
}

export class Background extends FlappyElement {
    static sprite: HTMLImageElement;

    constructor(world: World) {
        super();

        let scale = 1;
        let offset = {
            x: 0,
            y: 0
        };
        let timestamp: DOMHighResTimeStamp;

        assets.images.get("/images/background.png").then(sprite => {
            this.height = world.canvas.height;
            scale = this.height / sprite.height;
            timestamp = performance.now();

            this.update = (new_timestamp: DOMHighResTimeStamp) => {
                const elapsed = new_timestamp - timestamp;
                offset.x += this.speed.x * elapsed / scale / 1000;
                offset.y += this.speed.y * elapsed / scale / 1000;
                const end = {} as { x: number, y: number };
                end.x = offset.x + sprite.width;
                end.y = offset.y + sprite.height;
                if (end.x < 0) {
                    offset.x = end.x;
                }
                if (end.y < 0)
                    offset.y = end.y;
                timestamp = new_timestamp;
            }

            this._render = (ctx) => {
                ctx.imageSmoothingEnabled = false;

                ctx.drawImage(sprite, -offset.x, -offset.y, this.width / scale, this.height / scale, 0, 0, this.width, this.height);
                let x = offset.x ? offset.x + sprite.width : 0;
                let y = offset.y ? offset.y + sprite.height : 0;

                while (y < this.height / scale) {
                    while (x < this.width / scale) {
                        ctx.drawImage(sprite, 0, 0, this.width / scale, this.height / scale, x * scale, y * scale, this.width, this.height);
                        x += sprite.width;
                    }
                    y += sprite.height;
                }
            }

            this.speed.x = -100;
        })

        this.width = world.canvas.width;
        this.height = world.canvas.height;
    }
}

export default Background;