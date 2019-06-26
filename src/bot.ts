import Bird from "./bird";
import World from "./world";

export class Bot {
    update: () => void

    constructor(world: World, bird: Bird) {
        this.update = () => {
            if (world.killers.length > 0) {
                let killer = world.killers[0]
                let hitboxes: typeof killer.hitboxes = []
                let x = world.width;
                let y = 0;
                let w = 50;
                for (let hitbox of killer.hitboxes) {
                    if (hitbox.x < x) {
                        x = hitbox.x;
                    }
                }
                killer.hitboxes.forEach(hitbox => {
                    if (hitbox.x < x + w || hitbox.x < bird.width + 10) {
                        hitboxes.push(hitbox);
                        if(w < hitbox.width) w = hitbox.width;
                    }
                })
                hitboxes.some(hitbox => {
                    if (hitbox.y - y > 200 && y) {
                        y = hitbox.y;
                        return true;
                    }
                    else
                        y = hitbox.y + hitbox.height;
                    return false;
                });
                if(!y) y = world.height - world.wall_width;
                if (bird.y + bird.height + bird.speed.y / 30 + 10 >= y) {
                    bird.set_flying(true)
                }
                else {
                    bird.set_flying(false);
                }
            }
        }

        const key_handler = (ev: KeyboardEvent) => {
            if (ev.key !== " ") return;
            this.update = () => { };
            document.removeEventListener("keydown", key_handler);
        }
        const mouse_handler = () => {
            this.update = () => { };
            document.removeEventListener("mousedown", mouse_handler);
        }

        document.addEventListener("keydown", key_handler);
        document.addEventListener("mousedown", mouse_handler);
    }
}

export default Bot;