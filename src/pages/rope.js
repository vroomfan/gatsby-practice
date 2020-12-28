import React, { useEffect } from "react"

export default function Rotate() {
  useEffect(() => {
    new App();
  }, []);

  return (
    <div
      id="CanvasWrapper"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

class App {
  constructor() {
    this.wrapper = document.getElementById('CanvasWrapper');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.wrapper.appendChild(this.canvas);

    this.pixelRatio = (window.devicePixelRatio > 1) ? 1 : 1; // TODO

    this.mousePos = new Point();
    this.curItem = null;

    this.items = [];
    this.total = 5;
    for (let i = 0; i < this.total; i += 1) {
      this.items[i] = new Dialog();
    }

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));

    window.addEventListener('pointerdown', this.onDown.bind(this), false);
    window.addEventListener('pointermove', this.onMove.bind(this), false);
    window.addEventListener('pointerup', this.onUp.bind(this), false);
  }

  resize() {
    this.stageWidth = this.wrapper.clientWidth;
    this.stageHeight = this.wrapper.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';

    this.ctx.lineWidth = 2;

    for (let i = 0; i < this.items.length; i += 1) {
      this.items[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.items.length; i += 1) {
      this.items[i].animate(this.ctx);
    }

    if (this.curItem) {
      this.ctx.fillStyle = '#ff4338';
      this.ctx.strokeStyle = '#ff4338';

      this.ctx.beginPath();
      this.ctx.arc(this.mousePos.x, this.mousePos.y, 8 ,0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(this.curItem.centerPos.x, this.curItem.centerPos.y, 8 ,0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
      this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
      this.ctx.stroke();
    }
  }

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i].down(this.mousePos.clone());
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]); // 맨 위로 올리기
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i += 1) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i += 1) {
      this.items[i].up();
    }
  }
}

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  subtract(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  reduce(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  collide(point, width, height) {
    return this.x >= point.x &&
      this.x <= point.x + width &&
      this.y >= point.y &&
      this.y <= point.y + height;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

const FOLLOW_SPEED = 0.08;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const FPS = 1000 / 60;
const WIDTH = 260;
const HEIGHT = 260;

class Dialog {
  constructor() {
    this.pos = new Point();
    this.target = new Point();
    this.prevPos = new Point();

    this.downPos = new Point();
    this.startPos = new Point();
    this.mousePos = new Point();
    this.centerPos = new Point();
    this.origin = new Point();
    this.rotation = 0;
    this.sideValue = 0;
    this.isDown = false;
  }

  resize(stageWidth, stageHeight) {
    this.pos.x = Math.random() * (stageWidth - WIDTH);
    this.pos.y = Math.random() * (stageHeight - HEIGHT);
    this.target = this.pos.clone();
    this.prevPos = this.pos.clone();
  }

  animate(ctx) {
    const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPEED);
    this.pos.add(move);

    this.centerPos = this.pos.clone().add(this.mousePos);

    this.swingDrag(ctx);

    this.prevPos = this.pos.clone();
  }

  swingDrag(ctx) {
    const dx = this.pos.x - this.prevPos.x;
    const speedX = Math.abs(dx) / FPS;
    const speed = Math.min(Math.max(speedX, 0), 1);

    let rotation = MAX_ANGLE * speed;
    rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

    this.rotation += (rotation - this.rotation) * ROTATE_SPEED;

    const tmpPos = this.pos.clone().add(this.origin);
    ctx.save();
    ctx.translate(tmpPos.x, tmpPos.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.beginPath();
    ctx.fillStyle = '#f4e55a';
    ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT);
    ctx.restore();
  }

  down(point) {
    if (point.collide(this.pos, WIDTH, HEIGHT)) {
      this.isDown = true;
      this.startPos = this.pos.clone();
      this.downPos = point.clone();
      this.mousePos = point.clone().subtract(this.pos);

      const xRatioValue = this.mousePos.x / WIDTH;
      this.origin.x = this.mousePos.x;
      this.origin.y = this.mousePos.y;

      this.sideValue = xRatioValue - 0.5;

      return this;
    } else {
      return null;
    }
  }

  move(point) {
    if (this.isDown) {
      this.target = this.startPos.clone().add(point).subtract(this.downPos);
    }
  }

  up() {
    this.isDown = false;
  }
}
