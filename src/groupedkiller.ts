import FlappyElement from "./element.js";
import World from "./world.js";
import BasicKiller from "./basickiller.js";
import Pillar from "./pillar.js";

export class GroupedKiller extends FlappyElement {
    constructor(world: World) {
        super()

        let killers: BasicKiller[] = [];

        const killer_width = 138 + 5;

        const count = 3 + Math.floor(Math.random() * 8);

        const sin_offset = Math.random() * 0.8 + 1.5;
        console.log(sin_offset);
        const wave_multiplier = Math.random() * 0.5 + 1;

        const margin = 10 + Math.max(80 * (wave_multiplier ** 1.2 - 1.5), 0);
        const final_length = 220 + Math.random() * 50 + margin / 3;

        Object.defineProperty(this, "killers", {
            get: () => killers
        });


        let last_postion = null as number;
        const position = (x: number) => {
            const length = final_length + (count - x - 1) * 5;
            let cy = length / 2;
            const min = Pillar.min_height + 10 + cy;
            const max = this.height - min;
            const sin = Math.sin(x * Math.PI * wave_multiplier / count + sin_offset);
            let r = min + (sin / 2 + 0.5) * (max - min - cy);
            if (last_postion && Math.abs(last_postion - r) > 80) {
                debugger;
                r = last_postion + 80 * (r > last_postion ? 1 : -1);
            }
            last_postion = r;
            return r;
        }


        for (let i = 0; i < count; ++i) {
            const killer = new BasicKiller(world);
            killers.push(killer);
        }

        this._update = timestamp => {
            for (let i = 0; i < killers.length; ++i) {
                let killer = killers[i];
                killer.update(timestamp);
            }
        }

        this._resized = () => {
            let killer: BasicKiller;
            for (let i = 0; i < killers.length; ++i) {
                killer = killers[i];
                killer.height = this.height;
                killer.x = i > 0 ? killers[i - 1].x + killer_width + margin : 0;
                killer.set_gap(position(i), final_length + (count - i - 1) * 200 / (count * 2));
            }
            this.width = killer.x + killer_width;
        }

        this._render = ctx => {
            for (let killer of killers) {
                killer.render(ctx);
            }
        }

        Object.defineProperty(this, "hitboxes", {
            get: () => {
                let i = this.x < 0 ? Math.floor(-this.x / (killer_width + margin)) : 0;
                let hitbox = [];
                for (; i < Math.min(i + 3, count); ++i)
                    hitbox.push(...killers[i].hitboxes)
                for (let box of hitbox) {
                    box.x += this.x;
                    box.y += this.y;
                }
                return hitbox;
            }
        })
    }
}

export default GroupedKiller;