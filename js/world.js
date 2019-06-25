export class World {
    constructor() {
        this.wall_width = 80;
        let canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.classList.add("flappy-world");
        this.context = canvas.getContext("2d", {
            alpha: false
        });
    }
    get width() { return this.canvas.width; }
    set width(value) { this.canvas.width = value; }
    get height() { return this.canvas.height; }
    set height(value) { this.canvas.height = value; }
    get canvas() { return this.context.canvas; }
    get fly_area() {
        return {
            x: 0,
            y: this.wall_width,
            width: this.width,
            height: this.height - 2 * this.wall_width
        };
    }
}
export default World;
