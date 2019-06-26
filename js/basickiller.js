import FlappyElement from "./element.js";
import Pillar from "./pillar.js";
export class BasicKiller extends FlappyElement {
    constructor(world, passage = {}) {
        super();
        this.gap = { position: 0, length: 0, top: 0, bottom: 0 };
        const min_pillar_size = Pillar.min_height + 10;
        this.set_gap = (position, length) => {
            if (!length)
                length = 220 + Math.random() * 60;
            this.gap.length = Math.min(length, this.height - 2 * min_pillar_size);
            if (!position)
                position;
            let cy = this.gap.length / 2;
            if (!position) {
                const min = min_pillar_size + cy;
                const max = this.height - min;
                position = min + Math.random() * (max - min - cy);
            }
            this.gap.position = Math.max(min_pillar_size + cy, Math.min(position, this.height - cy - min_pillar_size));
        };
        this._resized = this.set_gap.bind(this, passage.position, passage.length);
        this._resized();
        Object.defineProperty(this, "width", {
            get: () => pillars.top.width
        });
        this._render = (ctx) => {
            pillars.top.render(ctx);
            pillars.bottom.render(ctx);
        };
        this._update = timestamp => {
            pillars.top.height = this.gap.top;
            pillars.bottom.y = this.gap.bottom;
            pillars.bottom.height = this.height - this.gap.bottom;
        };
        const pillars = {
            top: new Pillar(world),
            bottom: new Pillar(world)
        };
        pillars.top.y = 0;
        pillars.top.rotation = 180;
        Object.defineProperties(this.gap, {
            top: { get: () => this.gap.position - this.gap.length / 2 },
            bottom: { get: () => this.gap.position + this.gap.length / 2 }
        });
        Object.defineProperties(this, {
            hitboxes: {
                get: () => {
                    let boxes = [...pillars.top.hitboxes, ...pillars.bottom.hitboxes];
                    for (let box of boxes) {
                        box.x += this.x;
                        box.y += this.y;
                    }
                    return boxes;
                }
            }
        });
    }
}
export default BasicKiller;
