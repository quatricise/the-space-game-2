class ShieldBubble {
  constructor(hitbox, color) {
    if(hitbox.type === "circle") this.hitbox = new CircleHitbox(hitbox.radius)
    this.color = color
  }
}