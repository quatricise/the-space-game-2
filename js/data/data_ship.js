data.ship = {}
data.ship["needle"] = {
  display_name: "Goldbird",
  model: "needle",
  hitbox: "bluebird_needle",
  rotation_speed_base: 110 * PI/180,
  glide_reduction: 0.03,
  base_mass: 18,
  weapon_slots: 4,
  hull: {
    level: 10,
    level_max: 20,
    curr: 10,
  },
  supports: {
      boosters: true,
      brakes: true,
      engine_steering: true,
      engine_braking: true,
      shields: true,
      stealth: true,
      weapons: true,
      cargo: true,
  },
  cargo: {
    capacity: 10,
    items: []
  },
  reactor: {
    power: 20,
    power_free: 20,
    power_max: 40,
    power_distribution: [],
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
      level_max: 5,
      power: 0,
    },
    boosters: {
      type: "continuous",
      level: 1,
      level_max: 5,
      power: 0,
      onupgrade: {
        accel: 0.5,
      },
    },
    engines: {
      main: {
        accel: 7,
        max_speed: 400,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power: 0,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      }, 
      steering: {
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        power: 0,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      level: 1,
      level_max: 4,
      power: 0,  
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      slots: 4,  
      power: 0,
      weapons: [],
    }
  },
},

data.ship["crimson"] = {
  display_name: "Crimson Fighter Class I",
  model: "crimson_fighter",
  hitbox: "crimson_fighter_small",
  rotation_speed_base: 110 * PI/180,
  glide_reduction: 0.02,
  base_mass: 10,
  weapon_slots: 2,
  hull: {
    level: 5,
    level_max: 20,
    curr: 5,
  },
  cargo: {
    capacity: 5,
    items: []
  },
  supports: {
    boosters: true,
    brakes: true,
    engine_steering: true,
    engine_braking: true,
    shields: true,
    stealth: true,
    weapons: true,
    cargo: true,
  },
  reactor: {
    power: 20,
    power_free: 20,
    power_max: 40,
    power_distribution: [],
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
      level_max: 5,
      power: 0,
    },
    boosters: {
      type: "continuous",
      level: 1,
      level_max: 5,
      power: 0,
      onupgrade: {
        accel: 0.5,
      },
    },
    engines: {
      main: {
        accel: 9,
        max_speed: 180,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power: 0,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },    
      steering: {        
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        power: 0,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      level: 1,
      level_max: 4,
      power: 0,  
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      slots: 4,  
      power: 0,
      weapons: [],
    }
  },
}

data.ship["wasp_fighter"] = {
  display_name: "Wasp Fighter",
  model: "wasp_fighter",
  hitbox: "wasp_fighter",
  rotation_speed_base: 120 * PI/180,
  glide_reduction: 0.028,
  base_mass: 15,
  weapon_slots: 2,
  hull: {
    level: 7,
    level_max: 20,
    curr: 7,
  },
  cargo: {
    capacity: 5,
    items: []
  },
  supports: {
    boosters: true,
    brakes: true,
    engine_steering: true,
    engine_braking: true,
    shields: true,
    stealth: true,
    weapons: true,
    cargo: true,
  },
  reactor: {
    power: 20,
    power_free: 20,
    power_max: 40,
    power_distribution: [],
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
      level_max: 5,
      power: 0,
    },
    boosters: {
      type: "continuous",
      level: 1,
      level_max: 5,
      power: 0,
      onupgrade: {
        accel: 0.5,
      },
    },
    engines: {
      main: {
        accel: 8,
        max_speed: 520,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power: 0,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },    
      steering: {        
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        power: 0,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      level: 1,
      level_max: 4,
      power: 0,  
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      slots: 4,  
      power: 0,
      weapons: [],
    }
  },
}

data.ship["the_grand_moth"] = {
  display_name: "The Grand Moth",
  model: "the_grand_moth",
  hitbox: "the_grand_moth",
  rotation_speed_base: 100 * PI/180,
  glide_reduction: 0.085,
  base_mass: 20,
  weapon_slots: [
    { x: 51.5, y: -47.5 },
    { x: 51.5, y: 47.5 },
    { x: -4.5, y: -76.5 },
    { x: -4.5, y: 74.5 },
  ],
  hull: {
    level: 12,
    level_max: 20,
    curr: 12,
  },
  cargo: {
    capacity: 5,
    items: []
  },
  supports: {
    boosters: true,
    brakes: true,
    engine_steering: true,
    engine_braking: true,
    shields: true,
    stealth: true,
    weapons: true,
    cargo: true,
  },
  reactor: {
    power: 20,
    power_free: 20,
    power_max: 40,
    power_distribution: [],
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
      level_max: 5,
      power: 0,
    },
    boosters: {
      type: "continuous",
      level: 1,
      level_max: 5,
      power: 0,
      onupgrade: {
        accel: 0.5,
      },
    },
    engines: {
      main: {
        accel: 8,
        max_speed: 420,
        level: 1,
        level_max: 5,
        power: 0,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },
      steering: {        
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.01,
        level: 1,
        level_max: 4,
        power: 0,
        onupgrade: {
          glide_reduction: 0.01,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      level: 3,
      level_max: 4,
      power: 0,  
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      slots: 4,  
      power: 0,
      weapons: [],
    }
  },
}