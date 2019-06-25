import assets from "./assets.js";
import FlappyElement from "./element.js";
export class RepeatedImage extends FlappyElement {
    constructor(src) {
        super();
        this.offset = {
            x: 0,
            y: 0
        };
        this.scale = 1;
        this.onload = (sprite) => { };
        assets.images.get(src).then(sprite => {
            this._render = (ctx) => {
                let x = this.offset.x;
                let y = this.offset.y;
                let scale = this.scale;
                while (y < this.height) {
                    x = this.offset.x;
                    while (x < this.width) {
                        ctx.drawImage(sprite, x, y, sprite.width * scale, sprite.height * scale);
                        x += sprite.width * scale;
                    }
                    y += sprite.height * scale;
                }
            };
            this.onload(sprite);
        });
    }
}
export class EndlessScroll extends RepeatedImage {
    constructor(src) {
        super(src);
        this.scrollspeed = {
            x: 0,
            y: 0
        };
        let timestamp;
        assets.images.get(src).then(sprite => {
            timestamp = performance.now();
            this._update = (new_timestamp) => {
                const elapsed = new_timestamp - timestamp;
                this.offset.x += this.scrollspeed.x * elapsed / 1000;
                this.offset.y += this.scrollspeed.y * elapsed / 1000;
                if (this.offset.x + sprite.width * this.scale < 0)
                    this.offset.x += sprite.width * this.scale;
                timestamp = new_timestamp;
            };
        });
    }
}
