export interface ISceneObject {
    name: string;
    enabled: boolean;
    position: IPoint;
    trace?: boolean;
    delta(scene: IScene): void;
    draw(scene: IScene): void;
}
export interface IScene {
    ctx: CanvasRenderingContext2D;
    add(obj: ISceneObject): IScene;
    remove(name: string): IScene;
    hide(name: string): IScene;
    show(name: string): IScene;
    hideAllButOne(name: string): IScene;
    updateByKey(name: string, obj: ISceneObject): IScene;
    update(obj: ISceneObject | ISceneObject[]): IScene;
    clear(): IScene;
    draw(): void;
    resize(): void;
    X(x: number): number;
    Y(y: number): number;
    scale: number;
    VisibleWorldHeight: number;
    width: number;
    height: number;
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
export interface IVector {
    start: IPoint;
    end: IPoint;
}