import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { hitTestCircle, ICircle, IScene, ISceneObject } from 'src/common/common';
import { Ball, IBallOptions } from 'src/papa/ball';
import { Scene } from 'src/papa/scene';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D | null = null;
  public world = 1000;  
  public title = 'Maria Gravity Project';  
  public mass = 60;
  public trail = 60;
  public fps = 60;
  public isSideNavOpen=true;
  public timeoutId: any;
  private requestId: number = 0;  
  public playing: boolean = false;
  public scene: IScene | null = null;
  public borderSize: number = 2;
  public num_of_balls: number = 1;
  public gravity: number = 0;
  public elasticity: number = 0.5;
  public friction: number = 0.008;

  public favorite(event: any) {
    window.alert("YAAAAA!")
  } 

  /**
   * Constructor for main app component
   * @param zone NG zone
   */
  constructor(private zone: NgZone) {    
  }

  private canStartHere(c2: ICircle): boolean {    
    if (!this.scene) return false;    
    let result = this.scene.objects.some(x => {
      if (x instanceof Ball) {
        const c1 = x as ICircle;
        return hitTestCircle(c1, c2);
      }      
      return false;
    });
    return !result;
  }

  /**
   * Start Simulation
   */
  public start(): void {
    if (!this.scene) return;
    const colors = ["green", "red", "yellow", "blue", "white", "gray", "pink", "orange"];

    for (let i = 0; i < this.num_of_balls; ++i) {
      let r = 5 + Math.random() * 10;
      let center = { x: r + Math.random() * (this.world - 2*r) , y: r + Math.random() * (this.scene.VisibleWorldHeight - 2 * r) };
      let c: ICircle = {
        center, 
        radius: r
      };
      while (!this.canStartHere(c)) {
        r = 5 + Math.random() * 10;
        center = { x: r + Math.random() * (this.world - 2 * r) , y: r + Math.random() * (this.scene.VisibleWorldHeight - 2 * r) };
        c = {
          center, 
          radius: r
        };
      }

      const ball = new Ball(`ball${i}`, {
        center: center,
        radius: r, 
        color: colors[Math.ceil(Math.random() * colors.length)],
        speed: 5 + Math.random() * 5,
        angle: Math.random() * 360,
        mass: 5 + Math.random() * 5,
        trace: true,
        trace_limit: this.trail
      });
      this.scene?.add(ball);
    }
      
    this.playing = true;
  }

  /**
   * Stop Simulation
   */
  public stop(): void {
    this.scene?.clear();
    this.playing = false;
  }

  public onTrailLengthChanged(trail_length: number): void {
    this.trail = trail_length;
    this.scene?.updateWithCondition(x => true, x => {
      x.trace_limit = trail_length;
      return x;
    });
  }
  public onGravityChanged(gravity: number): void {
    this.scene!.gravity = this.gravity = gravity;
  }
  public onElasticityChanged(e: number): void {
    this.scene!.elasticity = this.elasticity = e;
  }
  public onFrictionChanged(f: number): void {
    this.scene!.friction = this.friction = f;
  }

  /**
   * The DOM is loaded and all bindings are available
   */
  ngAfterViewInit(): void {    
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.setCanvasSize();    

    // Scene initialization
    this.scene = new Scene(this.ctx!, this.world, this.borderSize);
    this.scene.gravity = this.gravity;
    this.scene.elasticity = this.elasticity;
    this.scene.friction = this.friction;
    
    this.zone.runOutsideAngular(() =>     
      this.animate()
    );
  }

  /**
   * Clear canvas
   */
  public clear(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  /**
   * Draw background and all scene objects
   * Internally, every object calls it's delta method before drawing
   */
  public draw(): void {    
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.borderSize;    
    this.ctx.rect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); 
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();

    this.scene?.draw();
  }

  /**
   * Resize canvas and scene
   */
  public resize(): void {
    this.setCanvasSize();
    this.scene?.resize();
    this.draw();
  }

  /**
   * Setting Canvas size based on parent element
   */
  protected setCanvasSize(): void {
    if (!this.canvas) return;
    const parent: HTMLElement | null = this.canvas.nativeElement.parentElement;
    if (!parent) return;
    var rect = parent.getBoundingClientRect();
    this.canvas.nativeElement.width = rect.width;
    this.canvas.nativeElement.height = rect.height;
  }

  /**
   * Animation loop
   */
  protected animate(): void {
    this.clear();
    this.draw();
    this.requestId = requestAnimationFrame(() => {
      this.timeoutId = _.delay(() => this.animate(), 1000/this.fps);
    });
  }

  /**
   * Called on closing web application
   */
  public ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    cancelAnimationFrame(this.requestId);
  }

}
