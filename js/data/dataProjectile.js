data.projectile = {
  missileHelios: {
    speed: 500,
    mass: 6,
    impactDamage: 3,
    life: 30000,
    effects: [
      {
        type: "fire",
        chance: 0.5,
      }
    ],
    hitbox: {
      type: "polygonHitbox",
      filename: "projectileMissileHelios",
      definition: null
    },
    projectileData: {
      onHit: "explode",
      explosionSize: 500,
    }
  },
  debris: {
    speed: 550,
    mass: 8,
    impactDamage: 1,
    life: 30000,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 16,
      }
    },
    projectileData: {
      onHit: "dieAndCreateParticles",
      particleName: "debris",
    }
  },
  waspLaserFront: {

  },
  plasmaShotI: {
    speed: 680,
    mass: 2.5,
    impactDamage: 1,
    life: 10000,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 9,
      }
    },    
    projectileData: {
      onHit: "plasmaExplode",
    }
  },
  fireball: {
    speed: 440,
    mass: 5,
    impactDamage: 2,
    life: 12000, 
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 9,
      }
    },    
    mass: 1,
  },
  blackhole: {
    speed: 320,
    mass: 1000000,
    impactDamage: 3,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 7,
      }
    },    
    life: 12000, 
  },
  trapMissile: {
    speed: 820,
    mass: 2,
    impactDamage: 0,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 8,
      }
    },    
    life: 10000,
    projectileData: {
      onHit: "trapTarget",
    }
  },
  lava: {
    speed: 700,
    mass: 10,
    impactDamage: 2,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 10,
      }
    },    
    life: 10000,
    projectileData: {
      onHit: "dieAndCreateParticles",
      particleName: "lava",
    }
  },
  lavaBig: {
    speed: 650,
    mass: 15,
    impactDamage: 3,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 15,
      }
    },    
    life: 10000,
    projectileData: {
      onHit: "dieAndCreateParticles",
      particleName: "lava",
    }
  },
  lavaSmall: {
    speed: 800,
    mass: 3,
    impactDamage: 1,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 7,
      }
    },    
    life: 10000,
    projectileData: {
      onHit: "dieAndCreateParticles",
      particleName: "lava",
    }
  },
}