import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { CELESTIAL_BODIES, ICelestialBody } from 'src/common/common';
import { Square } from './square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D | null = null;

  public title = 'Maria Gravity Project';  
  public mass = 60;
  public fps = 30;
  public isSideNavOpen=true;
  public timeoutId: any;
  private requestId: number = 0;  
  public celestial_bodies: ICelestialBody[] = CELESTIAL_BODIES;
  public selectedBodyName: string = _.find(this.celestial_bodies, x => x.name === 'Mars')!.name;
  squares: Square[] = [];

  public gravity = _.first(this.celestial_bodies)?.gravity;
  public favorite(event: any) {
    window.alert("YAAAAA!")
  } 

  constructor(private zone: NgZone) {    
  }

  public get selectedBody(): ICelestialBody | undefined {
    if (!this.selectedBodyName) return undefined;
    return _.find(this.celestial_bodies, x => x.name === this.selectedBodyName)!;
  }

  public onSelectedBodyChanged(name: string) {
    this.selectedBodyName = name;
    const body = this.selectedBody;
    if (body && !body.image) {
        this.loadImage(body).then();
    }
  } 

  public drawAndFitBody(body: ICelestialBody) {
    if (!this.ctx || !body.image) {
      return;
    }    
    const img = body.image;
    const cwidth = this.ctx.canvas.width;
    const cheight = this.ctx.canvas.height;
    
    const scale_factor = Math.min(cwidth / img.width, cheight / img.height);
    const width = img.width * scale_factor;
    const height = img.height * scale_factor;
    const x = cwidth / 2 - width / 2;
    const y = cheight / 2 - height / 2;
    this.ctx.drawImage(img, x, y, width, height);
  }

  public async loadImage(body: ICelestialBody): Promise<void> {
    return new Promise<void>((resolve, reject) => {              
      const img = new Image();
      img.onload = () => {
        if (!this.ctx) {
          reject();
          return;
        }    
        body.image = img;
        resolve();
      };
      img.src =  'assets/celestial_bodies/' + (body.imageUrl || body.name.toLowerCase()) + '.jpg';
    });
  }

  ngAfterViewInit(): void {    
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.setCanvasSize();
    this.loadImage(this.selectedBody!);
    this.zone.runOutsideAngular(() =>     
      this.animate()
    );
    //this.interval = setInterval(() => this.animate(), 100);

    this.addSquare();
  }

  public addSquare() {
    if (!this.ctx) return;
    const square = new Square(this.ctx);
    this.squares = this.squares.concat(square);
  }
  
  public clearAllSquares() {
    if (!this.ctx) return;
    this.squares = [];
  }


  public clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  public draw() {    
    if (!this.ctx) return;
    
    if (this.selectedBodyName) {
      this.drawAndFitBody(this.selectedBody!);
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "pink";
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

    this.requestId = requestAnimationFrame(() => {
      this.timeoutId = _.delay(() => this.animate(), 1000/this.fps);
    });
  }

  public ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    cancelAnimationFrame(this.requestId);
  }

}
