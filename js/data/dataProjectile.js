data.projectile = {
  debugLaser: {
    speed: 320,
    impactDamage: 1,
    sprite: "debugLaser",
    hitbox: {
      type: "circle",
      radius: 8,
    },
    mass: 0.5,
    life: 5000, //time till the projectile either explodes or is destroyed
  },
  missileHelios: {
    sprite: "missileHelios",
    speed: 250,
    impactDamage: 3,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 0.5,
    life: 10000, 
  },
  plasmaCannonI: {
    sprite: "plasmaCannonI",
    speed: 440,
    impactDamage: 1,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 0.1,
    life: 10000, 
  },
  plasmaCannonII: {
    sprite: "plasmaCannonII",
    speed: 440,
    impactDamage: 2,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 0.1,
    life: 10000, 
  },
  fireball: {
    sprite: "fireball",
    speed: 280,
    impactDamage: 2,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 1,
    life: 12000, 
  },
  blackhole: {
    sprite: "blackhole",
    speed: 200,
    impactDamage: 3,
    hitbox: {
      type: "circle",
      radius: 7,
    },
    mass: 1,
    life: 12000, 
  },
}