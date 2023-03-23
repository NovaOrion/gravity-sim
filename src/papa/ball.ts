import { IPoint, IScene } from "src/common/common";
import { BaseObject } from "./base";
import * as _ from "lodash";

export interface IBallOptions {
    center: IPoint;
    radius: number;
    color: string;
    speed: number;
    angle: number;
    trace?: boolean;
}

export class Ball extends BaseObject {

    public radius: number;
    public color: string;
    public speed: number;
    public angle: number;

    private radians: number = 0; 
    private xunits: number = 0;
    private yunits: number = 0;

    constructor(name: string, public options: IBallOptions) {        
        super(name);
        this.position = this.options.center;
        this.radius = this.options.radius;
        this.color = this.options.color;
        this.speed = this.options.speed;
        this.angle = this.options.angle;        
        this.trace = _.get(this.options, "trace", false);
        this.updateBall();
    }

    private updateBall(): void {
        this.radians = this.angle * Math.PI / 180;
        this.xunits = Math.cos(this.radians) * this.speed;
        this.yunits = Math.sin(this.radians) * this.speed;
    }

    override delta(scene: IScene): void {
        super.delta(scene);        
        this.updateBall();
        this.position.x += this.xunits;
        this.position.y += this.yunits;    
        if (scene.X(this.position.x) >= scene.width || scene.X(this.position.x) <= 0) {
            this.angle = 180 - this.angle;            
            this.updateBall();
        }  else if (scene.Y(this.position.y) >= scene.height || scene.Y(this.position.y) <= 0) {
            this.angle = 360 - this.angle;
            this.updateBall();
        }
    }

    override draw(scene: IScene): void {
        super.draw(scene);
        const ctx = scene.ctx;
        if (ctx && this.radius > 0) {
            const x = scene.X(this.position.x);
            const y = scene.Y(this.position.y); 
            const r = scene.scale * this.radius;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }           
    }
}