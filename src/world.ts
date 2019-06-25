export class World {
    context: CanvasRenderingContext2D;

    get width() { return this.canvas.width; }
    set width(value: number) { this.canvas.width = value; }
    get height() { return this.canvas.height; }
    set height(value: number) { this.canvas.height = value; }
    get canvas() { return this.context.canvas; }

    wall_width = 80
    get fly_area() {
        return {
            x: 0,
            y: this.wall_width,
            width: this.width,
            height: this.height - 2 * this.wall_width
        }
    }

    constructor() {
        let canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.classList.add("flappy-world")
        this.context = canvas.getContext("2d", {
            alpha: false
        });
    }
}

export default World;