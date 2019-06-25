
class AssetMap<V>{
    map = new Map<string, Promise<V> | V>()
    get: (key: string) => Promise<V>;

    constructor(loader: (src: string) => Promise<V>)
    {
        this.get = async (src: string) => {
            if(this.map.has(src)) {
                return this.map.get(src);
            }else {
                let promise = loader(src);
                this.map.set(src, promise);
                return promise;
            }
        }
    }
}

class Assets{
    images: AssetMap<HTMLImageElement>
    audios: AssetMap<HTMLAudioElement>

    constructor()
    {
        this.images = new AssetMap((src) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                let img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror= reject;
            });
        });

        this.audios = new AssetMap(src => {
            return new Promise<HTMLAudioElement>((resolve, reject) => {
                let audio = new Audio();
                audio.src = src;
                audio.onload = () => resolve(audio);
                audio.onerror = reject;
            })
        });
    }
}

const AssetPaths = {
    bird: "images/flappy.png",
    background: "images/background.png",
    pillar: ["images/pillar/foot.png", "images/pillar/center.png", "images/pillar/top.png"]
}

const assets = new Assets;

export default assets;
export { AssetPaths, assets }