import Bird from "./bird.js";
import World from "./world.js";
import BasicKiller from "./basickiller.js";
import { EndlessScroll } from "./images.js";
import Bot from "./bot.js";
import GroupedKiller from "./groupedkiller.js";
const world = new World();
window.world = world;
{
    const r = window.innerWidth / window.innerHeight;
    world.height = 1000;
    world.width = world.height * r;
}
const bird = new Bird(world);
bird.y = world.height / 2;
let update_id = null;
const bot = new Bot(world, bird);
const background = new EndlessScroll("images/background.png");
background.width = world.width;
background.height = world.height;
background.scrollspeed.x = -100;
background.onload = (sprite) => {
    background.scale = background.height / sprite.height;
};
background.y = -world.wall_width + 10;
let pause = {
    timestamp: null,
    duration: 0
};
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (!pause.timestamp)
            pause.timestamp = performance.now();
    }
    else {
        if (!pause.timestamp)
            return;
        pause.duration += performance.now() - pause.timestamp;
        pause.timestamp = null;
    }
});
let walls = [
    new EndlessScroll("images/wall.png"),
    new EndlessScroll("images/wall.png")
];
for (let wall of walls) {
    wall.height = world.wall_width;
    wall.width = world.width;
    wall.scrollspeed.x = -250;
    wall.onload = (sprite) => {
        wall.scale = wall.height / sprite.height;
    };
}
walls[0].y = 0;
walls[1].y = world.height - world.wall_width;
function lose() {
    cancelAnimationFrame(update_id);
}
const update = (time) => {
    time -= pause.duration;
    update_id = requestAnimationFrame(update);
    let ctx = world.context;
    const killers = world.killers;
    ctx.clearRect(0, 0, world.width, world.height);
    background.update(time);
    background.render(ctx);
    bird.update(time);
    bot.update();
    if (walls[1].collide_with(bird))
        lose();
    else if (walls[0].collide_with(bird)) {
        const wall = walls[0];
        bird.y = 2 * wall.height - bird.y;
        bird.speed.y *= -0.5;
    }
    bird.render(ctx);
    while (!killers.length || killers[killers.length - 1].x < world.width) {
        const last = killers[killers.length - 1];
        const killer = new (Math.random() < 0.3 ? GroupedKiller : BasicKiller)(world);
        const x = last ? last.x + last.width : world.width / 2;
        killer.x = x + Math.max(Math.random() * 150 + 350 - (time / 250), 200);
        killer.speed.x = -250;
        killer.height = world.height - 2 * world.wall_width;
        killer.y = world.wall_width;
        killers.push(killer);
    }
    {
        let i = 0;
        while (killers[i].x + killers[i].width < 0)
            i++;
        killers.splice(0, i);
        world.score += i;
    }
    for (let killer of killers) {
        killer.update(time);
        killer.render(ctx);
        if (bird.collide_with(killer) || bird.y + bird.height >= world.height) {
            lose();
        }
    }
    walls.forEach(wall => {
        ctx.fillStyle = "white";
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        wall.update(time);
        wall.render(ctx);
    });
    {
        const cx = world.width / 2;
        const cy = world.wall_width / 2 + 3;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const size = 50;
        ctx.lineWidth = 3;
        const w = world.score < 100 ? size : size + 30;
        ctx.fillStyle = "rgba(150, 150, 200, 0.7)";
        ctx.fillRect(cx - w / 2, cy - size / 2 - 5, w, size);
        ctx.strokeStyle = "rgb(200, 200, 255)";
        ctx.strokeRect(cx - w / 2, cy - size / 2 - 5, w, size);
        // ctx.lineWidth = 1;
        ctx.font = "2.5rem Roboto";
        ctx.fillStyle = "rgb(235, 235, 255)";
        ctx.fillText(world.score.toString(), cx, cy);
    }
};
update_id = requestAnimationFrame(update);
