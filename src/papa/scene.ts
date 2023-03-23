import {OrderedMap} from 'immutable';
import * as _ from 'lodash';
import { IScene, ISceneObject } from 'src/common/common';

export class Scene implements IScene {
    
    protected sceneWidth: number = 0;
    protected sceneHeight: number = 0;
    protected padding: number = 0;

    constructor(public ctx: CanvasRenderingContext2D, public world: number, padding: number) { 
        this.padding = padding; 
        this.resize();
    }

    public resize(): void {
        this.sceneWidth = this.ctx?.canvas.width - 2 * this.padding;
        this.sceneHeight = this.ctx?.canvas.height - 2 * this.padding;
    }

    public get scale(): number {
        return this.sceneWidth / this.world;
    }

    public X(x: number) {      
        return Math.round(this.scale * x) + this.padding;
    }

    public Y(y: number) {
        const sh = this.sceneHeight;       
        return sh - Math.round(this.scale * y);
    }

    public get VisibleWorldHeight(): number { 
        return this.sceneHeight / this.scale;
    }

    // collection of all scene's objects to animate
    public objects = OrderedMap<string, ISceneObject>();

    // add to scene collection
    public add(obj: ISceneObject): IScene {
        this.objects = this.objects.set(obj.name, obj);
        return this;
    }

    // remove from scene collection
    public remove(name: string): IScene {
        this.objects = this.objects.delete(name);
        return this;
    }

    // hide object
    public hide(name: string): IScene {
        const obj = this.objects.get(name);
        if (obj) {
            obj.enabled = false;
            this.objects = this.objects.set(name, obj);
        }        
        return this;
    }

    // show object 
    public show(name: string): IScene {
        const obj = this.objects.get(name);
        if (obj) {
            obj.enabled = true;
            this.objects = this.objects.set(name, obj);
        }
        return this;
    }

    // hide all objects but one specified by name
    public hideAllButOne(name: string): IScene {
        this.objects.reduce((acc, val, key) => {
            val.enabled = (key === name);    
            return acc.set(key, val);
        }, OrderedMap<string, ISceneObject>());
        return this;
    }

    // update object by key
    public updateByKey(name: string, obj: ISceneObject): IScene {
        this.objects = this.objects.set(name, obj);
        return this;
    }

    // update obj or array of objects
    public update(obj: ISceneObject | ISceneObject[]): IScene {
        const inp: ISceneObject[] = _.isArrayLike(obj) ? obj : [obj];
        for (let i=0; i<inp.length; ++i) {
            this.updateByKey(inp[i].name, inp[i]);
        }
        return this;
    }

    // remove all objects from scene
    public clear(): IScene {
        this.objects = this.objects.clear();
        return this;        
    }

    // calculate delta and draw for each objects in scene in ordered manner
    public draw(): void {
        const filtered = this.objects.filter(x => x.enabled);
        filtered.forEach(x => x.delta(this));
        filtered.forEach(X => X.draw(this));
    }

    public get width(): number {
        return this.sceneWidth;
    }

    public get height(): number {
        return this.sceneHeight;
    }
}