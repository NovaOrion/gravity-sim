import {OrderedMap} from 'immutable';

export interface ISceneObject {
    name: string;
    enabled: boolean;
    position: IPoint;
    trace?: boolean;
    trace_limit?: number;
    delta(scene: IScene): void;
    collide(scene: IScene): void;
    draw(scene: IScene): void;
    draw_trace(scene: IScene): void;
}
export interface IScene {
    ctx: CanvasRenderingContext2D;
    objects: OrderedMap<string, ISceneObject>;
    add(obj: ISceneObject): IScene;
    remove(name: string): IScene;
    hide(name: string): IScene;
    show(name: string): IScene;
    hideAllButOne(name: string): IScene;
    updateByKey(name: string, obj: ISceneObject): IScene;
    update(obj: ISceneObject | ISceneObject[]): IScene;
    updateWithCondition(condition: (obj: ISceneObject) => boolean, map: (obj: ISceneObject) => ISceneObject): void;
    clear(): IScene;
    draw(): void;
    resize(): void;
    X(x: number): number;
    Y(y: number): number;
    scale: number;
    VisibleWorldHeight: number;
    width: number;
    height: number;
    gravity: number;
    elasticity: number;
    friction: number;
}
export interface IPoint {
    x: number;
    y: number;
}
export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IVector {
    x: number;
    y: number;
}
export interface ICircle {
    center: IPoint;
    radius: number;
}
export function hitTestCircle(c1: ICircle, c2: ICircle): boolean {
    let result = false;
    const dx = c1.center.x - c2.center.x;
    const dy = c1.center.y - c2.center.y;
    const distance = (dx*dx + dy*dy);
    if (distance <= (c1.radius + c2.radius) * (c1.radius + c2.radius)) {
        result = true;
    }
    return result;
}
export class Vector implements IVector {

    constructor(public x: number, public y: number) {        
    }
    public add(v: IVector) : IVector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    public sub(v: IVector): IVector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    public mul(n: number): IVector {
        this.x *= n;
        this.y *= n;
        return this;
    }
    public div(n: number): IVector {
        this.x /= n;
        this.y /= n;
        return this;
    }
    public get magnitude(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    public normalize(): IVector {
        const magnitude = this.magnitude;
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }
    public dir(direction: number): IVector {
        const magnitude = this.magnitude;
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
        return this;
    }
    static unitVector(direction: number): IVector {
        return new Vector(Math.cos(direction), Math.sin(direction));
    }
    static fromPolar(length: number, angle: number): IVector {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    }
}