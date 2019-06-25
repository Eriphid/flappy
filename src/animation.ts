export namespace Easing{
    export function linear(a: number, b: number, t: number)
    {
        return (b - a) * t;
    }

    export function expo_out(a: number, b: number, t: number)
    {
        return (b - a) * (-Math.pow(2, -10 * t) + 1)
    }
}
export class Tween {
    at: (time: any) => number;
    start: (time: number) => void;
    update: (time: number) => void;
    setter: (value: number) => void;
    static create(beg: number, end: number, dur: number) {
        const animation = new Tween();
        animation.beg = beg;
        animation.end = end;
        animation.dur = dur;

        return animation;
    }

    beg: number = 0
    end: number = 1
    dur: number = 1000
    ease = Easing.linear

    value: number
    current_timestamp: number

    start_timestamp: number = null
    finished: boolean
    constructor() {
        const data = {
            timestamp: null as number
        }
        this.at = (time) => {
            return this.beg + this.ease(this.beg, this.end, Math.max(0, Math.min(time / this.dur, 1)));
        }

        this.update = (time: DOMHighResTimeStamp) => {
            data.timestamp = time;
            this.setter(this.value);
        }

        this.start = (time: DOMHighResTimeStamp) => {
            this.start_timestamp = time;
        }
        this.setter = (value: number) => {};
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
        })
    }
}

export default Tween;