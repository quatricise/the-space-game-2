data.satellite = {
  weatherSatelliteSmall: {
    displayName: "Small Weather Satellite",
    hitbox: {
      type: "polygonHitbox",
      filename: "weatherSatelliteSmall",
      definition: null,
    },
    systems: [
      "cargo"
    ],
    mass: 20,
    health: 3,
    cargo: {
      capacity: 50,
      items: [
        "microchipX1"
      ],
    },
    wreck: {
      count: 5,
      hitboxVaultName: "weatherSatelliteSmall",
    },
  }
}