import { IVector } from "./common";

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
    public dotProduct(v: IVector): number {
        return (this.x * v.x) + (this.y * v.y);
    }
    public crossProduct(v: IVector): number {
        return (this.x * v.x) - (this.y - v.y);
    }

    // static methods
    static unitVector(direction: number): IVector {
        return new Vector(Math.cos(direction), Math.sin(direction));
    }
    static fromPolar(length: number, angle: number): IVector {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    }

    public toString(): string {
        return `Vector <${this.x},${this.y}>`;
    }
}