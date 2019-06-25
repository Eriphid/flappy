export var Easing;
(function (Easing) {
    function linear(a, b, t) {
        return (b - a) * t;
    }
    Easing.linear = linear;
    function expo_out(a, b, t) {
        return (b - a) * (-Math.pow(2, -10 * t) + 1);
    }
    Easing.expo_out = expo_out;
})(Easing || (Easing = {}));
export class Tween {
    constructor() {
        this.beg = 0;
        this.end = 1;
        this.dur = 1000;
        this.ease = Easing.linear;
        this.start_timestamp = null;
        const data = {
            timestamp: null
        };
        this.at = (time) => {
            return this.beg + this.ease(this.beg, this.end, Math.max(0, Math.min(time / this.dur, 1)));
        };
        this.update = (time) => {
            data.timestamp = time;
            this.setter(this.value);
        };
        this.start = (time) => {
            this.start_timestamp = time;
        };
        this.setter = (value) => { };
        Object.defineProperties(this, {
            value: {
                get: () => this.at(this.current_timestamp - this.start_timestamp)
            },
            finished: {
                get: () => this.current_timestamp >= this.start_timestamp + this.dur
            },
            current_timestamp: {
                get: () => data.timestamp
            }
        });
    }
    static create(beg, end, dur) {
        const animation = new Tween();
        animation.beg = beg;
        animation.end = end;
        animation.dur = dur;
        return animation;
    }
}
export default Tween;
