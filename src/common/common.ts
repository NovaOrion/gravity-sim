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
    mode: AppMode;
    inPause: boolean;
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
    add(v: IVector) : IVector;
    sub(v: IVector): IVector;
    mul(n: number): IVector;
    div(n: number): IVector;
    magnitude: number; 
    normalize(): IVector; 
    dir(direction: number): IVector;
    dotProduct(v: IVector): number;
    crossProduct(v: IVector): number;    
    toString(): string;
    isNull: boolean;
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

export enum AppMode {
    About, 
    EarthGravity, 
    SpaceGravity
}

export enum SymState {
    Playing,
    Paused,
    Stopped
}