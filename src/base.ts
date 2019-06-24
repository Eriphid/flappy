
const canvas = document.getElementById("flappy") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Rect {
    x: number
    y: number
    width: number
    height: number
}

function intersect(a: Rect, b: Rect) {
    return a.x + a.width >= b.x && a.x <= b.x + b.width
        && a.y + a.height >= b.y && a.y <= b.y + b.height;
}

function extend_method<T, Name extends keyof T, Func extends T[Name] & Function>(obj: T, name: Name, func: Func, extend_order: "before" | "after" = "before") {
    const org_func = obj[name]/*  || obj.prototype[name] */ as Func;
    if (extend_order === "before") {
        obj[name] = ((...args: any[]) => {
            func(...args);
            org_func(...args);
        }) as any;
    }
    else {
        obj[name] = ((...args: any[]) => {
            org_func(...args);
            func(...args);
        }) as any;
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
    x: number = 0
    y: number = 0
    width: number = 100
    height: number = 100
    bounds: Rect
    rotation: number = 0
    speed = { x: 0, y: 0 }

    hitboxes: Rect[]
    tweens: Tween[] = []
    update: (time: number) => void;

    collide_with(element: FlappyElement) {
        for (let this_box of this.hitboxes) {
            for (let other_box of element.hitboxes) {
                if (intersect(this_box, other_box)) return true;
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

    constructor() {
        Object.defineProperties(this, {
            bounds: {
                get: () => ({ x: this.x, y: this.y, width: this.width, height: this.height })
            },
            hitboxes: {
                get: () => [this.bounds],
                configurable: true
            }
        });

        this.update = (time: DOMHighResTimeStamp) => {
            this.tweens.forEach(x => x.update(time));
            this.x += this.speed.x;
            this.y += this.speed.y;
        }
    }
}