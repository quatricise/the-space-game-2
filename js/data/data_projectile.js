data.projectile = {
  debug_laser: {
    speed: 320,
    impact_damage: 1,
    sprite: "debug_laser",
    hitbox: {
      type: "circle",
      radius: 8,
    },
    mass: 0.5,
    life: 5000, //time till the projectile either explodes or is destroyed
  },
  missile_helios: {
    sprite: "missile_helios",
    speed: 250,
    impact_damage: 3,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 0.5,
    life: 10000, 
  },
  plasma_cannon_i: {
    sprite: "plasma_cannon_i",
    speed: 440,
    impact_damage: 1,
    hitbox: {
      type: "circle",
      radius: 9,
    },
    mass: 0.1,
    life: 10000, 
  },
  plasma_cannon_ii: {
    sprite: "plasma_cannon_ii",
    speed: 440,
    impact_damage: 2,
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
    impact_damage: 2,
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
    impact_damage: 3,
    hitbox: {
      type: "circle",
      radius: 7,
    },
    mass: 1,
    life: 12000, 
  },
}