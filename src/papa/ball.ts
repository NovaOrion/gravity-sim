import { IPoint, IScene, ISceneObject } from "./scene";

export class Ball implements ISceneObject {

    public enabled: boolean = true;

    constructor(public name: string, public center: IPoint, public radius: number, public color: string) {        
    }

    delta(scene: IScene): void {
        
    }

    draw(scene: IScene): void {
        const ctx = scene.ctx;
        if (ctx && this.radius > 0) {
            const x = scene.X(this.center.x);
            const y = scene.Y(this.center.y); 
            const r = scene.scale * this.radius;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }    
    }
}