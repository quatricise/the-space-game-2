data.ship = {}

data.ship["theGrandMoth"] = {
  displayName: "The Grand Moth",
  designation: "cruiser",
  hitbox: {
    type: "polygonHitbox",
    filename: "theGrandMoth",
    definition: null,
  },
  weaponSlots: [
    { x: 55, y: -45 },
    { x: 55, y: 45 },
    { x: 0, y: -75 },
    { x: 0, y: 75 },
  ],
  mass: 55,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
    "coater",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    rechargeTime: 500,
    strength: 750,
    onupgrade: {
      acceleration: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 100,
    auto: true,
  },
  cargo: {
    capacity: 50,
    items: [],
  },
  engine: {
    angularVelocity: (140 * PI) / 180,
    glideReduction: 0.07,
    acceleration: 8,
    maxSpeed: 400,
    skipRechargeTime: 2800,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (10 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 15,
    levelMax: 20,
    current: 15,
    impactResistance: 100,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 700,
      pulseStrength: 1000,
      arcLength: PI, 
      rechargeTimeMS: 1600,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  coater: {
    layersMax: 2
  },
  weapons: {
    slots: 4,
    power: 0,
    weapons: [
      "missileHelios",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "theGrandMoth",
  },
}
data.ship["waspFighter"] = {
  displayName: "Wasp Fighter I",
  designation: "fighter",
  hitbox: {
    type: "polygonHitbox",
    filename: "waspFighter",
    definition: null,
  },
  weaponSlots: [
    { x: 80, y:  0 },
    { x: 38, y: -32 },
    { x: 38, y:  32 },
  ],
  mass: 35,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 650,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 8,
    levelMax: 20,
    current: 12,
    impactResistance: 80,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 320,
      pulseStrength: 1000,
      arcLength: PI/1.2, 
      rechargeTimeMS: 1800,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 3,
    power: 0,
    weapons: [
      "waspLaserFront",
      "trapMissile",
      "plasmaCannonI",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighter"
  }
}
data.ship["waspFighterII"] = {
  displayName: "Wasp Fighter II",
  designation: "fighter",
  hitbox: {
    type: "polygonHitbox",
    filename: "waspFighterII",
    definition: null,
  },
  weaponSlots: [
    { x: 25, y: -54 },
    { x: 25, y:  54 },
  ],
  mass: 35,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 650,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 10,
    levelMax: 20,
    current: 10,
    impactResistance: 150,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 320,
      pulseStrength: 1000,
      arcLength: PI/1.2, 
      rechargeTimeMS: 1800,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 4,
    power: 0,
    weapons: [
      "plasmaCannonI",
      "plasmaCannonI",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighterII"
  }
}
data.ship["communistFighterI"] = {
  displayName: "Liberation Fighter I",
  designation: "fighter",
  hitbox: {
    type: "polygonHitbox",
    filename: "communistFighterI",
    definition: null,
  },
  weaponSlots: [
    { x: 25, y: -54 },
    { x: 25, y:  54 },
  ],
  mass: 35,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (140 * PI) / 180,
    glideReduction: 0.05,
    acceleration: 10,
    maxSpeed: 480,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 6,
    levelMax: 12,
    current: 6,
    impactResistance: 120,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 420,
      pulseStrength: 1000,
      arcLength: PI/1.2, 
      rechargeTimeMS: 1800,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 4,
    power: 0,
    weapons: [
      "plasmaChain",
      "plasmaCannonII",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighterII"
  }
}
data.ship["lavaShipI"] = {
  displayName: "Lava Cruiser I",
  designation: "cruiser",
  hitbox: {
    type: "polygonHitbox",
    filename: "lavaShipI",
    definition: null,
  },
  weaponSlots: [
    { x: 105, y: -6 },
    { x: 63, y: -55 },
    { x: 1, y: 63 },
  ],
  mass: 120,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (75 * PI) / 180,
    glideReduction: 0.04,
    acceleration: 5,
    maxSpeed: 480,
    skipRechargeTime: 4500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 12,
    levelMax: 12,
    current: 12,
    impactResistance: 120,
    properties: {
      hotTouch: true
    }
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 420,
      pulseStrength: 1000,
      arcLength: PI / 1.2,
      rechargeTimeMS: 1800,
    },
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 3,
    power: 0,
    weapons: ["lavaGun"],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighterII",
  },
};
data.ship["starBee"] = {
  displayName: "Star Bee",
  designation: "scout",
  hitbox: {
    type: "polygonHitbox",
    filename: "starBee",
    definition: null,
  },
  weaponSlots: [
    { x: 32, y: 23 },
    { x: 32, y: -23 },
  ],
  mass: 35,
  systems: [
    "cargo",
    "engine",
    "brakes",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 360,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 6,
    levelMax: 20,
    current: 12,
    impactResistance: 60,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "front",
      distance: 250,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 2,
    weapons: [
      "plasmaCannonI",
      "plasmaCannonI",
    ]
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighter"
  }
}