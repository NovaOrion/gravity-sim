import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as _ from 'lodash';
import { Square } from './square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D | null = null;
  private requestId: number = 0;
  title = 'Maria Gravity Project';  
  public mass=60;
  public isSideNavOpen=true;
  public interval: any;
  public celestial_bodies = [
    {
      name: "Earth",
      gravity: 9.8
    },
    {
      name: "Moon",
      gravity: 1.6
    },
    {
      name: "Mars",
      gravity: 3.7
    },
    {
      name: "Venus",
      gravity: 8.87
    },
    {
      name: "Jupiter",
      gravity: 24.5
    }    
  ];
  squares: Square[] = [];

  public gravity = _.first(this.celestial_bodies)?.gravity;
  public favorite(event: any) {
    window.alert("YAAAAA!")
  } 

  constructor(private zone: NgZone) {    
  }

  ngAfterViewInit(): void {    
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.zone.runOutsideAngular(() => this.animate());
    this.interval = setInterval(() => this.animate(), 100);

    this.play();
  }

  public play() {
    if (!this.ctx) return;
    const square = new Square(this.ctx);
    this.squares = this.squares.concat(square);
  }

  public clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  public draw() {    
    if (!this.ctx) return;
    this.ctx.strokeStyle="#FFFFFF";
    this.ctx.beginPath();
    this.ctx.arc(100,100,50,0,2*Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#999";
    this.ctx.rect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); 
    this.ctx.stroke();
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
    this.squares.forEach((sq: Square) => {
      sq.moveRight();
    })
    this.requestId = requestAnimationFrame(() => this.animate);
  }

  public ngOnDestroy(): void {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

}
