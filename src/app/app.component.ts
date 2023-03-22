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

  constructor(private zone: NgZone) {    
  }

  public start(): void {
    const r = 5;
    this.scene
      ?.add(new Ball("ball1", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "yellow"))
      .add(new Ball("ball2", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "red"))
      .add(new Ball("ball3", { x: Math.random() * (this.world - r/2), y: Math.random() * (this.scene.VisibleWorldHeight - r/2) }, r, "green"));
  }

  public stop(): void {
    this.scene?.clear();
  }

  ngAfterViewInit(): void {    
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.setCanvasSize();
    
    this.scene = new Scene(this.ctx!, this.world);
    
    this.zone.runOutsideAngular(() =>     
      this.animate()
    );
  }

  public clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  public draw() {    
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "pink";
    this.ctx.rect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); 
    this.ctx.stroke();
    this.scene?.draw();
  }

  public resize() {
    this.setCanvasSize();
    this.draw();
  }

  protected setCanvasSize() {
    if (!this.canvas) return;
    const parent: HTMLElement | null = this.canvas.nativeElement.parentElement;
    if (!parent) return;
    var rect = parent.getBoundingClientRect();
    this.canvas.nativeElement.width = rect.width;
    this.canvas.nativeElement.height = rect.height;
  }

  protected animate() {
    this.clear();
    this.draw();
    this.requestId = requestAnimationFrame(() => {
      this.timeoutId = _.delay(() => this.animate(), 1000/this.fps);
    });
  }

  public ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    cancelAnimationFrame(this.requestId);
  }

}
