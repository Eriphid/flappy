function intersect(a, b) {
    return a.x + a.width >= b.x && a.x <= b.x + b.width
        && a.y + a.height >= b.y && a.y <= b.y + b.height;
}
export class FlappyElement {
    // transform: DOMMatrix
    constructor() {
        this._render = (ctx) => { };
        this._update = (timestamp) => { };
        this._resized = () => { };
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.speed = { x: 0, y: 0 };
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
            let timestamp = null;
            this.update = (new_timestamp) => {
                const elapsed = timestamp ? new_timestamp - timestamp : 0;
                this.x += this.speed.x * elapsed / 1000;
                this.y += this.speed.y * elapsed / 1000;
                timestamp = new_timestamp;
                // transform = new DOMMatrix;
                // const cx = this.width / 2, cy = this.height / 2;
                // transform.translateSelf(this.x + cx, this.y + cy);
                // transform.rotateSelf(this.rotation * Math.PI / 180);
                // // transform.rotateSelf(this.rotation * Math.PI / 180, this.rotation * Math.PI / 180, this.rotation * Math.PI / 180);
                // transform.translateSelf(-cx, -cy);
                this._update(new_timestamp);
            };
            Object.defineProperty(this, "transform", {
                get: () => transform
            });
        }
        let properties = {
            width: 100,
            height: 100
        };
        Object.defineProperties(this, {
            width: {
                get: () => properties.width,
                set: value => {
                    if (properties.width === value) {
                        if (value == 138)
                            debugger;
                        return;
                    }
                    properties.width = value;
                    this._resized();
                },
                configurable: true
            },
            height: {
                get: () => properties.height,
                set: value => {
                    if (properties.height === value)
                        return;
                    properties.height = value;
                    this._resized();
                },
                configurable: true
            }
        });
        this.render = (ctx) => {
            ctx.save();
            // ctx.transform(this.transform.a, this.transform.b, this.transform.c, this.transform.d, this.transform.e, this.transform.f);
            const cx = this.width / 2, cy = this.height / 2;
            ctx.translate(this.x + cx, this.y + cy);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.translate(-cx, -cy);
            this._render(ctx);
            ctx.restore();
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
}
export default FlappyElement;
