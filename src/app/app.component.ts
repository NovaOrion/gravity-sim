import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AppMode, hitTestCircle, ICircle, IScene, ISceneObject } from 'src/common/common';
import { Ball, IBallOptions } from 'src/papa/ball';
import { Scene } from 'src/papa/scene';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage') canvas!: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D | null = null;
  public world = 1000;  
  public title = 'Maria Gravity Project';  
  public mass = 1;
  public trail = 100;
  public fps = 60;
  public isSideNavOpen=true;
  public timeoutId: any;
  private requestId: number = 0;  
  public playing: boolean = false;
  public scene: IScene | null = null;
  public borderSize: number = 2;
  public num_of_balls: number = 100;
  public gravity: number = 0;
  public elasticity: number = 0.5;
  public friction: number = 0.008;
  public mode: AppMode = AppMode.SpaceGravity;
  public AppMode = AppMode;
  public favorite(event: any) {
    window.alert("YAAAAA!")
  } 

  /**
   * Constructor for main app component
   * @param zone NG zone
   */
  constructor(private zone: NgZone) {    
  }

  public toggleMode(mode: AppMode): void {
    this.mode = mode;
    this.num_of_balls = AppMode.EarthGravity ? 10 : 100;
    this.trail = AppMode.EarthGravity ? 100 : 100;
    this.scene?.clear();
    this.playing = false;
    this.initSym();
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
      let r = 3 + Math.random();
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
        speed: Math.random() * 10,
        angle: Math.random() * 360,
        mass: r,
        trace: true,
        trace_limit: this.trail
      });
      this.scene?.add(ball);
    }

    if (this.mode === AppMode.SpaceGravity) {
      const ball = new Ball("sun", {
        center: {x: this.world / 2, y: this.scene.VisibleWorldHeight / 2},
        radius: 25, 
        color: "orange",
        speed: 0,
        angle: 0,
        mass: this.mass * 1000,
        trace: false,      
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
  public onSunMassChanged(m: number): void {
    const sun_colors = [{

    }];
    this.mass = m;
    const sun = this.scene?.objects.get("sun") as Ball;
    sun.mass = this.mass = m;
    this.scene?.updateByKey("sun", sun);
  }

  public initSym(): void {
    if (this.mode === AppMode.About) {
      return;
    }
    _.delay(() => {
      this.ctx = this.canvas.nativeElement.getContext("2d");
      this.setCanvasSize();    

      // Scene initialization
      this.scene = new Scene(this.ctx!, this.world, this.borderSize);
      this.scene.mode = this.mode;
      this.scene.gravity = this.gravity;
      this.scene.elasticity = this.elasticity;
      this.scene.friction = this.friction;
      
      this.zone.runOutsideAngular(() =>     
        this.animate()
      );
    }, 10);
  }

  /**
   * The DOM is loaded and all bindings are available
   */
  ngAfterViewInit(): void {   
    this.initSym();   
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
