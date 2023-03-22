import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Ball } from 'src/papa/ball';
import { IScene, Scene } from 'src/papa/scene';

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
  public fps = 30;
  public isSideNavOpen=true;
  public timeoutId: any;
  private requestId: number = 0;  

  public scene: IScene | null = null;

  public favorite(event: any) {
    window.alert("YAAAAA!")
  } 

  /**
   * Constructor for main app component
   * @param zone NG zone
   */
  constructor(private zone: NgZone) {    
  }

  /**
   * Start Simulation
   */
  public start(): void {
    const r = 5;
    this.scene
      ?.add(new Ball("ball1", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "yellow"))
      .add(new Ball("ball2", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "red"))
      .add(new Ball("ball3", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "green"));
  }

  /**
   * Stop Simulation
   */
  public stop(): void {
    this.scene?.clear();
  }

  /**
   * The DOM is loaded and all bindings are available
   */
  ngAfterViewInit(): void {    
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.setCanvasSize();
    
    this.scene = new Scene(this.ctx!, this.world);
    
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
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "pink";
    this.ctx.rect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); 
    this.ctx.stroke();
    this.scene?.draw();
  }

  /**
   * Resize canvas and scene
   */
  public resize(): void {
    this.setCanvasSize();
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
