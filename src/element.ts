import Tween from "./animation.js";

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

// export function extend_method<T, Name extends keyof T, Func extends T[Name] & Function>(obj: T, name: Name, func: Func, extend_order: "before" | "after" = "before") {
//     const org_func = obj[name]/*  || obj.prototype[name] */ as Func;
//     if (extend_order === "before") {
//         obj[name] = ((...args: any[]) => {
//             func(...args);
//             org_func(...args);
//         }) as any;
//     }
//     else {
//         obj[name] = ((...args: any[]) => {
//             org_func(...args);
//             func(...args);
//         }) as any;
//     }
// }

export class FlappyElement {
    _render = (ctx: CanvasRenderingContext2D) => {}
    _update = (timestamp: DOMHighResTimeStamp) => {}

    x: number = 0
    y: number = 0
    width: number = 100
    height: number = 100
    bounds: Rect
    rotation: number = 0
    speed = { x: 0, y: 0 }

    hitboxes: Rect[]
    tweens: Tween[] = []
    update: (timestamp: number) => void;
    render: (ctx: CanvasRenderingContext2D) => void;

    collide_with(element: FlappyElement) {
        for (let this_box of this.hitboxes) {
            for (let other_box of element.hitboxes) {
                if (intersect(this_box, other_box)) return true;
            }
        }
        return false;
    }
    
    transform: DOMMatrix

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
        {
            let transform = new DOMMatrix;
            let timestamp = null as DOMHighResTimeStamp;
            this.update = (new_timestamp: DOMHighResTimeStamp) => {
                this.tweens.forEach(x => x.update(new_timestamp));
                const elapsed = timestamp ? new_timestamp - timestamp : 0;
                this.x += this.speed.x * elapsed / 1000;
                this.y += this.speed.y * elapsed / 1000;
                timestamp = new_timestamp;

                transform = new DOMMatrix;
                const cx = this.width / 2, cy = this.height / 2;
                transform.translateSelf(this.x + cx, this.y + cy);
                transform.rotateSelf(this.rotation * Math.PI / 180);
                // transform.rotateSelf(this.rotation * Math.PI / 180, this.rotation * Math.PI / 180, this.rotation * Math.PI / 180);
                transform.translateSelf(-cx, -cy);

                this._update(new_timestamp);
            }
            Object.defineProperty(this, "transform", {
                get: () => transform
            })
        }

        this.render = (ctx: CanvasRenderingContext2D) => {
            ctx.save();
            // ctx.transform(this.transform.a, this.transform.b, this.transform.c, this.transform.d, this.transform.e, this.transform.f);
            
            const cx = this.width / 2, cy = this.height / 2;
            ctx.translate(this.x + cx, this.y + cy);
            ctx.rotate(this.rotation * Math.PI / 180);
            // ctx.rotate(this.rotation * Math.PI / 180, this.rotation * Math.PI / 180, this.rotation * Math.PI / 180);
            ctx.translate(-cx, -cy);

            this._render(ctx);

            ctx.restore();
        }
    }
}

export default FlappyElement;