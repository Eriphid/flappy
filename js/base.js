"use strict";
const canvas = document.getElementById("flappy");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function intersect(a, b) {
    return a.x + a.width >= b.x && a.x <= b.x + b.width
        && a.y + a.height >= b.y && a.y <= b.y + b.height;
}
function extend_method(obj, name, func, extend_order = "before") {
    const org_func = obj[name] /*  || obj.prototype[name] */;
    if (extend_order === "before") {
        obj[name] = ((...args) => {
            func(...args);
            org_func(...args);
        });
    }
    else {
        obj[name] = ((...args) => {
            org_func(...args);
            func(...args);
        });
    }
}
// function draw(element: {
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     rotation: number
// }, method: Function) {
//     ctx.save();
//     const cx = element.width / 2, cy = element.height / 2;
//     ctx.translate(element.x + cx, element.y + cy);
//     // ctx.rotate(element.rotation * Math.PI / 180);
//     ctx.translate(-cx, -cy);
//     method(0, 0, element.width, element.height);
//     ctx.restore();
// }
class FlappyElement {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.rotation = 0;
        this.speed = { x: 0, y: 0 };
        this.tweens = [];
        Object.defineProperties(this, {
            bounds: {
                get: () => ({ x: this.x, y: this.y, width: this.width, height: this.height })
            },
            hitboxes: {
                get: () => [this.bounds],
                configurable: true
            }
        });
        this.update = (time) => {
            this.tweens.forEach(x => x.update(time));
            this.x += this.speed.x;
            this.y += this.speed.y;
        };
    }
    collide_with(element) {
        for (let this_box of this.hitboxes) {
            for (let other_box of element.hitboxes) {
                if (intersect(this_box, other_box))
                    return true;
            }
        }
        return false;
    }
    apply_transform() {
        const cx = this.width / 2, cy = this.height / 2;
        ctx.translate(this.x + cx, this.y + cy);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-cx, -cy);
    }
}
