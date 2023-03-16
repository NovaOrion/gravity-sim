export class Square {
    private color = Square.randomColor(128);
    private x = 0;
    private y = 0;
    private z = 15;
    private step = 10;
  
    private direction = 1;

    static randomColor(brightness: number){
      function randomChannel(b: number){
        var r = 255-b;
        var n = 0|((Math.random() * r) + b);
        var s = n.toString(16);
        return (s.length==1) ? '0'+s : s;
      }
      return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
    }

    constructor(private ctx: CanvasRenderingContext2D) {
      this.y = Math.floor(Math.random() * (this.ctx.canvas.height / this.z));
      this.x = Math.floor(Math.random() * (this.ctx.canvas.width / this.z));
      this.direction = Math.floor(Math.random() * 100) % 2 ? 1 : -1;
    }
  
    moveRight() {
      const canvas = this.ctx.canvas;
      const newX = this.step * (this.x + this.direction) + this.z;
      if (this.direction > 0) {
        if (newX < canvas.width) {
          this.x += this.direction;       
        } else {
          this.direction = -this.direction;
        }
      } else {
        if (newX > 0) {
          this.x += this.direction;
        } else {
          this.direction = -this.direction;
        }
      }      
      this.draw();
    }
  
    private draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.step * this.x, this.step * this.y, this.z, this.z);
      
    }
}