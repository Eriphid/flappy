import FlappyElement from "./element.js";
import assets from "./assets.js";
export class Pillar extends FlappyElement {
    constructor(world) {
        super();
        let ctx = world.context;
        Promise.all([
            assets.images.get("/images/pillar/foot.png"),
            assets.images.get("/images/pillar/center.png"),
            assets.images.get("/images/pillar/top.png")
        ]).then(sprites => {
            const base_width = this.width = Math.max(sprites[2].width, sprites[0].width, sprites[1].width);
            Object.defineProperties(this, {
                hitboxes: {
                    get: () => {
                        return [
                            {
                                x: this.x,
                                y: this.y,
                                width: this.width,
                                height: sprites[2].height
                            },
                            {
                                x: this.x + (this.width - sprites[1].width) / 2,
                                y: this.y + sprites[2].height,
                                width: sprites[1].width,
                                height: this.height - (sprites[0].height + sprites[2].height)
                            },
                            {
                                x: this.x,
                                y: this.y + this.height - sprites[0].height,
                                width: this.width,
                                height: sprites[0].height
                            }
                        ];
                    }
                }
            });
            this._render = () => {
                const scale_x = this.width / base_width;
                const sizes = {
                    top: sprites[2].width * scale_x,
                    center: sprites[1].width * scale_x,
                    foot: sprites[0].width * scale_x
                };
                ctx.translate(this.width / 2, 0);
                ctx.drawImage(sprites[0], -sizes.foot / 2, this.height - sprites[0].height, sizes.foot, sprites[0].height);
                ctx.drawImage(sprites[1], -sizes.center / 2, sprites[2].height, sizes.center, this.height - (sprites[0].height + sprites[2].height));
                ctx.drawImage(sprites[2], -sizes.top / 2, 0, sizes.top, sprites[2].height);
            };
        });
    }
}
export default Pillar;
