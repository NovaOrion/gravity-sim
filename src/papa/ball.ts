import { hitTestCircle, ICircle, IPoint, IScene } from "src/common/common";
import { BaseObject } from "./base";
import * as _ from "lodash";

export interface IBallOptions {
    center: IPoint;
    radius: number;
    color: string;
    speed: number;
    angle: number;
    trace?: boolean;
    trace_limit?: number;
    mass: number;
}
export class Ball extends BaseObject implements ICircle {

    public radius: number;
    public color: string;
    public speed: number;
    public angle: number;
    public mass: number;

    private radians: number = 0; 
    private x_velocity: number = 0;
    private y_velocity: number = 0;

    constructor(name: string, public options: IBallOptions) {        
        super(name);
        this.position = this.options.center;
        this.radius = this.options.radius;
        this.color = this.options.color;
        this.speed = this.options.speed;
        this.angle = this.options.angle;        
        this.mass = this.options.mass;
        this.trace = _.get(this.options, "trace", false);
        this.trace_limit = _.get(this.options, "trace_limit", 0);
        this.bounds = { width: 2 * this.radius, height: 2 * this.radius };
        this.radians = this.angle * Math.PI / 180;
        this.x_velocity = Math.cos(this.radians) * this.speed;
        this.y_velocity = Math.sin(this.radians) * this.speed; 
        this.update();
    }

    private update(scene?: IScene): void {   
        if (scene && scene.gravity) {
            this.y_velocity -= scene.gravity;
        }               
        this.position.x += this.x_velocity;
        this.position.y += this.y_velocity;              

        console.log(`gravity ${scene?.gravity} ball ${this.x_velocity} ${this.y_velocity}`);
    }

    private testWalls(scene: IScene): void {
        const bw = this.bounds.width / 2;
        const bh = this.bounds.height / 2;

        if (scene.X(this.position.x + bw) >= scene.width) {
            this.x_velocity = -1 * this.x_velocity;
            this.position.x = scene.width / scene.scale - bw;
        } else if (scene.X(this.position.x - bw) <= scene.X(0)) {
            this.x_velocity = -1 * this.x_velocity;
            this.position.x = bw;
        }
        if (this.position.y >= scene.VisibleWorldHeight) {
            this.y_velocity = -1 * this.y_velocity;
            this.position.y = scene.VisibleWorldHeight - bh;
        } else if (scene.Y(this.position.y - bh) >= scene.Y(0)) {
            if (scene && scene.elasticity) {
                this.y_velocity = -1 * this.y_velocity * scene.elasticity;
            }
            if (scene && scene.friction) {
                this.x_velocity = this.x_velocity -  (this.x_velocity * scene.friction);
            } 
            this.position.y = bh;
        }
    }

    private process_collide(scene: IScene, ball: Ball) {        
        const ball2 = ball;

        const dx = this.position.x - ball2.position.x;
        const dy = this.position.y - ball2.position.y;

        const collisionAngle = Math.atan2(dy, dx);

        const speed1 = Math.sqrt(this.x_velocity * this.x_velocity + this.y_velocity * this.y_velocity);
        const speed2 = Math.sqrt(ball2.x_velocity * ball2.x_velocity + ball2.y_velocity * ball2.y_velocity);

        const direction1 = Math.atan2(this.y_velocity, this.x_velocity);
        const direction2 = Math.atan2(ball2.y_velocity, ball2.x_velocity);

        const x_velocity_1 = speed1 * Math.cos(direction1 - collisionAngle);
        const y_velocity_1 = speed1 * Math.sin(direction1 - collisionAngle);
        const x_velocity_2 = speed2 * Math.cos(direction2 - collisionAngle);
        const y_velocity_2 = speed2 * Math.sin(direction2 - collisionAngle);

        const final_x_velocity_1 = ((this.mass - ball2.mass) * x_velocity_1 + (ball2.mass + ball2.mass) * x_velocity_2)/(this.mass + ball2.mass);
        const final_x_velocity_2 = ((this.mass + this.mass) * x_velocity_1 + (ball2.mass - this.mass) * x_velocity_2)/(this.mass + ball2.mass);

        const final_y_velocity_1 = y_velocity_1;
        const final_y_velocity_2 = y_velocity_2;

        this.x_velocity = Math.cos(collisionAngle) * final_x_velocity_1 + Math.cos(collisionAngle + Math.PI/2) * final_y_velocity_1;
        this.y_velocity = Math.sin(collisionAngle) * final_x_velocity_1 + Math.sin(collisionAngle + Math.PI/2) * final_y_velocity_1;
        ball2.x_velocity = Math.cos(collisionAngle) * final_x_velocity_2 + Math.cos(collisionAngle + Math.PI/2) * final_y_velocity_2;
        ball2.y_velocity = Math.sin(collisionAngle) * final_x_velocity_2 + Math.sin(collisionAngle + Math.PI/2) * final_y_velocity_2;

        this.position.x += this.x_velocity;
        this.position.y += this.y_velocity;
        ball2.position.x += ball2.x_velocity;
        ball2.position.y += ball2.y_velocity;
        scene.updateByKey(this.name, this);
        scene.updateByKey(ball2.name, ball2);
    }

    override collide(scene: IScene): void {
        const hit_object = scene.objects.find(x => {
            if (x instanceof Ball && x.name !== this.name) {
                const c1 = x as ICircle;
                return hitTestCircle(c1, this);
            }
            return false;
        });
        if (hit_object) {
            const b = hit_object as Ball;
            this.process_collide(scene, b);
        }
    }

    override delta(scene: IScene): void {
        super.delta(scene);        
        this.update(scene);
        this.testWalls(scene); 
        scene.updateByKey(this.name, this);
    }

    override draw(scene: IScene): void {
        super.draw(scene);
        const ctx = scene.ctx;
        if (ctx && this.radius > 0) {
            const x = scene.X(this.position.x);
            const y = scene.Y(this.position.y); 

            const radius = scene.scale * this.radius;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }           
    }

    public get center(): IPoint {
        return this.position;
    }
}