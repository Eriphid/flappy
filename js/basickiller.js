import FlappyElement from "./element.js";
import Pillar from "./pillar.js";
export class Tunnel extends FlappyElement {
    constructor(world) {
        super();
        this.passage = { position: 0, length: 0, top: 0, bottom: 0 };
        const pad = 120;
        const onresize = () => {
            this.passage.length = Math.min(200 + Math.random() * 100, this.height - 2 * pad);
            this.passage.position = pad + Math.random() * (this.height - pad * 2 - this.passage.length) + this.passage.length / 2;
        };
        {
            let height = world.height;
            Object.defineProperty(this, "height", {
                get: () => height,
                set: (value) => {
                    height = value;
                    onresize();
                }
            });
        }
        onresize();
        this._render = (ctx) => {
            pillars.top.render(ctx);
            pillars.bottom.render(ctx);
        };
        this._update = timestamp => {
            pillars.top.height = this.passage.top;
            pillars.bottom.y = this.passage.bottom;
            pillars.bottom.height = this.height - this.passage.bottom;
        };
        const pillars = {
            top: new Pillar(world),
            bottom: new Pillar(world)
        };
        pillars.top.y = 0;
        pillars.top.rotation = 180;
        Object.defineProperty(this, "width", {
            get: () => pillars.top.width
        });
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
                    return boxes;
                }
            }
        });
    }
}
export default Tunnel;
