import { IPoint, IScene, ISceneObject } from "src/common/common";

export class BaseObject implements ISceneObject {
    
    public enabled: boolean = true;
    public trace: boolean = false;
    public position: IPoint;

    protected trace_points: IPoint[] = [];

    constructor(public name: string) {
        this.position = {x: 0, y: 0};
    }

    delta(scene: IScene): void {
        if (this.trace) {
            this.trace_points.push({x: this.position.x, y: this.position.y});        
        }
    }

    draw(scene: IScene): void {
        const ctx = scene.ctx;
        if (this.trace && ctx) {
            this.trace_points.forEach(pt => {
                ctx.beginPath();
                ctx.arc(scene.X(pt.x), scene.Y(pt.y), 1, 0, 2 * Math.PI);
                ctx.fillStyle = "gray";
                ctx.fill();
            });
        }
    }
}