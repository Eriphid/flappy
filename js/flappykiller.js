import FlappyElement from "./element.js";
export class FlappyKiller extends FlappyElement {
    constructor() {
        super(...arguments);
        this.score = 1;
    }
}
export default FlappyKiller;
