import FlappyElement from "./element.js";
export class Bird extends FlappyElement {
    constructor(world) {
        super();
        let ctx = world.context;
        let timestamp = performance.now();
        const flight = {
            timestamp: 0,
            y: 0,
            held: false
        };
        const onload = () => {
            let r = Bird.sprite.width / Bird.sprite.height;
            this.height = 40;
            this.width = this.height * r;
        };
        if (!Bird.sprite || !Bird.sprite.complete) {
            if (!Bird.sprite)
                Bird.sprite = new Image();
            Bird.sprite.src = "images/flappy.png";
            Bird.sprite.onload = onload;
        }
        if (Bird.sprite.complete) {
            onload();
        }
        this._update = new_timestamp => {
            const elapsed = new_timestamp - timestamp;
            const g = elapsed * 3;
            this.speed.y = Math.min(this.speed.y + g, 1000);
            if ((timestamp - flight.timestamp) > 150 && flight.held) {
                this.speed.y = -800;
                this.rotation = -30;
                flight.y = this.y;
                flight.timestamp = new_timestamp;
            }
            // this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
            if (this.y > flight.y)
                this.rotation = Math.min(90, this.rotation + (this.rotation + 120) / 20);
            timestamp = new_timestamp;
        };
        this._render = (ctx) => {
            ctx.drawImage(Bird.sprite, 0, 0, this.width, this.height);
        };
        this.set_flying = (value) => { flight.held = value; };
        document.addEventListener("keydown", (ev) => {
            let prevent_default = true;
            switch (ev.key) {
                case " ":
                    this.set_flying(true);
                    break;
                default:
                    prevent_default = false;
                    break;
            }
            if (prevent_default)
                ev.preventDefault();
        });
        document.addEventListener("keyup", (ev) => {
            switch (ev.key) {
                case " ":
                    this.set_flying(false);
                    break;
                default:
                    break;
            }
        });
    }
}
export default Bird;
