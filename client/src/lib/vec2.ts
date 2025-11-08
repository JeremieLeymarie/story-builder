export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y?: number) {
    this.x = x;
    this.y = y ?? x;
  }

  add(...others: Vec2[]): Vec2 {
    const result = Vec2.from(this);
    others.forEach((other) => {
      result.x += other.x;
      result.y += other.y;
    });
    return result;
  }

  subtract(...others: Vec2[]): Vec2 {
    const result = Vec2.from(this);
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
}
