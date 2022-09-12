data.shield_types = {
  bubble: {
    desc: "Generates a permanent shield bubble protecting your craft from hard projectiles. Doesn't work well for lasers",
    level: 1,
    level_max: 2,
    recharge: 500, //ms
  },
  pulse: {
    desc: "The mechanism generates a short burst of energy around the craft, diverting any incoming projectiles",
    level: 1,
    level_max: 2,
    recharge: 1000, //ms
  },
  force: {
    desc: "prevents your ship from touching neighboring ships by gently pushing you away, this visually manifests as a soft blue glow around the edges of the craft",
    level: 1,
    level_max: 2,
    recharge: 0, //ms
  },
  hard_light: {
    desc: "blocks everything, even from the inside, impractical to fully shield yourself, because you cannot shoot",
    dispotitions: [
      "front",
      "side",
      "flank",
    ],
    level: 1,
    level_max: 5,
    recharge: 0,
  },
}