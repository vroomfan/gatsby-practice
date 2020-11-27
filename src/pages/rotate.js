import React, { useEffect } from "react"

export default function Rotate() {
  useEffect(() => {
    new App();
  }, []);

  return (
    <div
      id="CanvasWrapper"
      style={{ width: '50vw', height: '50vh' }}
    />
  );
}

class App {
  constructor() {
    this.wrapper = document.getElementById('CanvasWrapper');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.wrapper.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.isDown = false;
    this.moveX = 0;
    this.offsetX = 0;
    window.addEventListener('pointerdown', this.onDown.bind(this), false);
    window.addEventListener('pointermove', this.onMove.bind(this), false);
    window.addEventListener('pointerup', this.onUp.bind(this), false);

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = this.wrapper.clientWidth;
    this.stageHeight = this.wrapper.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.polygon = new Polygon(
      this.stageWidth / 2,
      this.stageHeight + (this.stageHeight / 5),
      this.stageHeight / 2,
      12,
    );
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.moveX *= 0.92;
    this.polygon.animate(this.ctx, this.moveX);
  }

  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.offsetX = e.clientX;
  }

  onMove(e) {
    if (this.isDown) {
      this.moveX = e.clientX - this.offsetX;
      this.offsetX = e.clientX;
    }
  }

  onUp(e) {
    this.isDown = false;
  }
}

const PI2 = Math.PI * 2;
const COLORS = [
  '#1b90fc',
  '#e41215',
  '#fca122',
  '#a21799',
  '#27c3a5',
  '#d85a18',
  '#cc9858',
  '#1b8bc9',
  '#2bd220',
  '#5ec5c7',
  '#1b1476',
  '#53b31c',
  '#9fb41f',
  '#535353',
  '#8b9aaa',
];

class Polygon {
  constructor(x, y, radius, sides) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.rotate = 0;
  }

  animate(ctx, moveX) {
    ctx.save(); // NOTE: 이해 못함
    // ctx.fillStyle = '#000';
    // ctx.beginPath();

    const angle = PI2 / this.sides;
    const angle2 = PI2 / 4;

    ctx.translate(this.x, this.y);

    this.rotate += moveX * 0.008;
    ctx.rotate(this.rotate);

    for(let i = 0; i < this.sides; i += 1) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      ctx.save();
      ctx.fillStyle = COLORS[i];
      ctx.translate(x, y);
      ctx.rotate(((360 / this.sides) * i + 45) * (Math.PI / 180));
      ctx.beginPath();
      for (let j = 0; j < 4; j += 1) {
        const x2 = 50 * Math.cos(angle2 * j);
        const y2 = 50 * Math.sin(angle2 * j);
        (j === 0) ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      // // (i === 0) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      //
      // ctx.beginPath();
      // ctx.arc(x, y, 20, 0, PI2, false);
      // ctx.fill();
    }

    // ctx.fill();
    // ctx.closePath();
    ctx.restore(); // NOTE: 이해 못함
  }
}
