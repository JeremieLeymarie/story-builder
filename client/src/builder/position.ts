export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y?: number) {
    this.x = x;
    this.y = y ?? x;
  }

  mul(factor: number): Vec2 {
    return new Vec2(this.x * factor, this.y * factor);
  }

  div(factor: number): Vec2 {
    return this.mul(1 / factor);
  }

  add(...others: Vec2[]): Vec2 {
    const acc = new Vec2(this.x, this.y);
    others.forEach((other) => {
      acc.x += other.x;
      acc.y += other.y;
    });
    return acc;
  }

  sub(...others: Vec2[]): Vec2 {
    return this.mul(-1)
      .add(...others)
      .mul(-1);
  }

  static dist(a: Vec2, b: Vec2): number {
    const tri = a.sub(b);
    return Math.hypot(tri.x, tri.y);
  }

  static from(some: { x: number; y: number }) {
    return new Vec2(some.x, some.y);
  }

  static ZERO = new Vec2(0);
  static ONE = new Vec2(1);
  static INFINITY = new Vec2(Infinity);
  static NEG_INFINITY = new Vec2(-Infinity);
}
