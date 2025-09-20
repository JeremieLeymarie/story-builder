export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y?: number) {
    this.x = x;
    this.y = y ?? x;
  }

  add(...others: Vec2[]): Vec2 {
    const result = new Vec2(this.x, this.y);
    others.forEach((other) => {
      result.x += other.x;
      result.y += other.y;
    });
    return result;
  }

  subtract(...others: Vec2[]): Vec2 {
    const result = new Vec2(this.x, this.y);
    others.forEach((vec) => {
      result.x -= vec.x;
      result.y -= vec.y;
    });
    return result;
  }

  static distance(a: Vec2, b: Vec2): number {
    const tri = a.subtract(b);
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
