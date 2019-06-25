import Bird from "./bird.js";
import World from "./world.js";
import Tunnel from "./basickiller.js";
import Background from "./background.js";


const world = new World();

world.width = window.innerWidth;
world.height = window.innerHeight;
class Bot {
    update: () => void

    constructor(bird: Bird) {
        this.update = () => {
            if (tunnels.length > 0) {
                if (bird.y + bird.height + bird.speed.y / 30 >= tunnels[0].passage.bottom + tunnels[0].y) {
                    bird.set_flying(true)
                }
                else {
                    bird.set_flying(false);
                }
            }
        }

        document.addEventListener("keydown", () => {
            this.update = () => { };
        })
    }
}

const bird = new Bird(world);
let tunnels: Tunnel[] = [];
let update_id = null;
const bot = new Bot(bird);
const background = new Background(world);
const pad = 80;
background.y = -pad + 10;

const update = (time: DOMHighResTimeStamp) => {
    update_id = requestAnimationFrame(update);
    let ctx = world.context;

    ctx.clearRect(0, 0, world.width, world.height);

    background.update(time);
    background.render(ctx);

    bot.update();
    bird.update(time);
    bird.render(ctx);

    while (!tunnels.length || tunnels[tunnels.length - 1].x < world.width) {
        const last = tunnels[tunnels.length - 1];
        const tunnel = new Tunnel(world);
        const x = last ? last.x + last.width : world.width / 2;
        tunnel.x = x + Math.random() * 500 + 300;
        tunnel.speed.x = -250;
        tunnel.height = world.height - 2 * pad;
        tunnel.y = pad;
        tunnels.push(tunnel)
    }
    {
        let i = 0;
        while (tunnels[i].x + tunnels[i].width < 0) i++;
        tunnels.splice(0, i);
    }
    for (let tunnel of tunnels) {
        tunnel.update(time);
        tunnel.render(ctx);
        if (bird.collide_with(tunnel) || bird.y + bird.height >= world.height) {
            cancelAnimationFrame(update_id);
        }
    }
}


update_id = requestAnimationFrame(update);