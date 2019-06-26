import FlappyElement from "./element.js";
import World from "./world.js";
import assets from "./assets.js";

export class Bird extends FlappyElement {
    update: (time: number) => void;
    set_flying: (value: boolean) => void;

    static sprite: HTMLImageElement;

    constructor(world: World) {
        super();

        let timestamp = performance.now();
        const flight = {
            y: 0,
            held: false,
            speed: 700,
            timestamp: null as number,
            audio: null as HTMLAudioElement
        }
        assets.audios.get("audios/flight.wav").then(audio => {
            flight.audio = audio;
        }).catch(console.error);

        const onload = () => {
            let r = Bird.sprite.width / Bird.sprite.height;
            this.height = 40;
            this.width = this.height * r;
        }
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
            if (flight.held || new_timestamp - flight.timestamp < 50) {
                this.speed.y = -flight.speed;
                this.rotation = -30;
                flight.y = this.y;
                if (!flight.timestamp) {
                    if (flight.audio) {
                        flight.audio.currentTime = 0;
                        flight.audio.volume = 0.5;
                        flight.audio.play().catch(console.error);
                    }
                    flight.timestamp = new_timestamp;
                }
            }
            else {
                flight.timestamp = null;
            }
            // this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
            if (this.y > flight.y)
                this.rotation = Math.min(90, this.rotation + (this.rotation + 120) / 20);
            timestamp = new_timestamp;
        };

        this._render = (ctx) => {
            ctx.drawImage(Bird.sprite, 0, 0, this.width, this.height);
        }

        this.set_flying = (value: boolean) => {
            flight.held = value;
        }

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
            if (prevent_default) ev.preventDefault();
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
        document.addEventListener("mousedown", () => {
            this.set_flying(true);
        })
        document.addEventListener("mouseup", () => {
            this.set_flying(false);
        })
    }
}

export default Bird;