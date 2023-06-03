data.station = {
  crownDockingStationLarge: {
    displayName: "Crown Service Station St. Francis",
    type: "repair",
    mass: 100000,
    dockingPoints: [{x: 150, y: 12}],
    hitbox: {
      type: "polygonHitbox",
      filename: "crownDockingStationLarge",
      definition: null,
    },
    wares: {weapons: [
        {name: "missileHelios"},
        {name: "trapMissile"},
        {name: "debrisGun"},
        {name: "plasmaChain"},
        {name: "plasmaCannonI"},
        {name: "plasmaCannonII"},
    ],systems: [],misc: []},
  },
  introDepotStation: {
    displayName: "Crown Depot Station",
    type: "repair",
    mass: 4500,
    dockingPoints: [{x: 266, y: 0}],
    hitbox: {
      type: "polygonHitbox",
      filename: "introDepotStation",
      definition: null,
    },
    wares: {
      weapons: [
        {name: "missileHelios"},
        {name: "trapMissile"},
        {name: "debrisGun"},
        {name: "plasmaChain"},
        {name: "plasmaCannonI"},
        {name: "plasmaCannonII"},
      ],
      systems: [
        {name: "forceFieldShields"}
      ],
      misc: [
        {name: "electronicsShipment"}
      ]
    },
  },
  crownOrbitalHive: {
    displayName: "Hive City",
    type: "civilian",
    mass: 8000,
    dockingPoints: [],
    hitbox: {
      type: "polygonHitbox",
      filename: "crownOrbitalHive",
      definition: null,
    },
    wares: {
      weapons: [],
      systems: [],
      misc: [],
    },
  },
}
