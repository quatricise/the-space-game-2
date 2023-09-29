class InteractionEvent {
  constructor(obj1, obj2) {
    this.obj1 = obj1
    this.obj2 = obj2
  }
}
class CollisionEvent extends InteractionEvent {
  constructor(obj1, obj2, collisionData) {
    super(obj1, obj2)
    this.collisionData = collisionData
    
    if(preferences.allProjectilesDoSingularPointOfDamage) {
      if(obj1 instanceof Projectile)
        this.impactDamage = obj1.impactDamage
      if(obj2 instanceof Projectile)
        this.impactDamage = obj2.impactDamage
      else
        this.impactDamage = 1
    }
    else {
      this.impactDamage = 1
    }

    if(obj1 instanceof Projectile) {
      this.collisionPoint = obj1.transform.position.clone()
      this.collisionType = "projectile"
    }
    else
    if(obj2 instanceof Projectile) {
      this.collisionPoint = obj2.transform.position.clone()
      this.collisionType = "projectile"
    }
    else {
      this.collisionType = "impact"
    }

    this.impactSpeed = obj1.transform.velocity.clone().sub(obj2.transform.velocity).length()
  }
  static fakeEvent(/** @type Integer */ impactDamage, /** @type Float */ impactSpeed, /** @type Vector */ collisionPoint) {
    return {
      obj1: null,
      obj2: null,
      collisionType: "impact",
      impactDamage, 
      impactSpeed,
      collisionPoint,
    }
  }
}

class TriggerEvent extends InteractionEvent {
  constructor(obj1, obj2) {
    super(obj1, obj2)
  }
}

class LightEvent extends InteractionEvent {
  constructor(light, visibleObject) {
    super(light, visibleObject)
    this.visibleObject = visibleObject
    this.light = light
  }
}