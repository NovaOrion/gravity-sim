import { IRect, IScene, ISceneObject } from "./scene";

export class Box implements ISceneObject {

    public enabled: boolean = true;
    

    constructor(public name: string, public rect: IRect) {
    }

    public delta(scene: IScene): void {
        // do nothing
    }

    public draw(scene: IScene): void {
        const ctx = scene.ctx;
        if (ctx && this.rect.width && this.rect.height > 0) {
            const x = scene.X(this.rect.x); const w = scene.X(this.rect.x + this.rect.width) - x;
            const y = scene.Y(this.rect.y); const h = scene.Y(this.rect.y + this.rect.height) - y;
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, w, h);
        }
    }
}