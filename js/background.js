"use strict";
class Background extends FlappyElement {
    constructor() {
        super();
        let scale = 1;
        let offset = {
            x: 0,
            y: 0
        };
        const onload = () => {
            this.height = canvas.height;
            scale = this.height / Background.sprite.height;
        };
        if (!Background.sprite || !Background.sprite.complete) {
            if (!Background.sprite)
                Background.sprite = new Image();
            Background.sprite.onload = onload;
            Background.sprite.src = "/images/background.jpg";
        }
        this.width = canvas.width;
        this.height = canvas.height;
        let timestamp = performance.now();
        this.update = (new_timestamp) => {
            const elapsed = new_timestamp - timestamp;
            offset.x += this.speed.x * elapsed;
            offset.y += this.speed.y * elapsed;
            const end = {};
            end.x = offset.x / scale + Background.sprite.width;
            end.y = offset.y / scale + Background.sprite.height;
            if (end.x < 0)
                offset.x = end.x;
            if (end.y < 0)
                offset.y = end.y;
            timestamp = new_timestamp;
        };
        this.render = () => {
            this.apply_transform();
            // debugger;
            // console.log(scale);
            ctx.drawImage(Background.sprite, -offset.x / scale, -offset.y / scale, this.width / scale, this.height / scale, 0, 0, Background.sprite.width * scale, this.height);
            let x = offset.x + Background.sprite.width * scale;
            let y = offset.y + Background.sprite.height * scale;
            console.log(x, this.width);
            while (x < this.width) {
                ctx.drawImage(Background.sprite, 0, 0, this.width / scale, this.height / scale, x, y, Background.sprite.width * scale, this.height);
                x += Background.sprite.width * scale;
                y += Background.sprite.height * scale;
                // break;
            }
        };
        this.speed.x = -0.1;
    }
}
