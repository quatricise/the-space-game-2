data.item = {
  princessWristband: {
    //"name" must match the key under which the datablock is stored, because I'm stupid
    //"thumbnail" can be anything, the game will look for a PNG with that name, this is mostly going to be the same value as "name"
    name: "princessWristband",
    title: "Princess's wristband",
    thumbnail: "princessWristband",
    description: 
    `A personal security wristband worn by all high-ranking persons of the Crown. This one belongs to the princess Livie Valois.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  princessHandkerchief: {
    name: "princessHandkerchief",
    title: "Princess's handkerchief",
    thumbnail: "princessHandkerchief",
    description: 
    `This handkerchief was found in her room. We can use the DNA to track her across public records, if her identity were to be changed.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  mysteriousOldShipment: {
    name: "mysteriousOldShipment",
    title: "Mysterious Old Shipment",
    thumbnail: "mysteriousOldShipment",
    description: 
    `This crate has been sitting on this ship for ages. Who knows what's in it.`,
    sellValue: 25,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  datadrive: {
    name: "datadrive",
    title: "Datadrive with Princess's ship signature",
    thumbnail: "datadrive",
    description: 
    `Using the data found on this drive, it's possible to decipher the destination of the departing ship.
    However, that won't be enough without access to a beacon interface.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  debris: {
    name: "debris",
    title: "A bit of debris.",
    thumbnail: "debris",
    description: 
    `bit of debris from a man-made object. Contains mostly steel, copper, gold and rubber.`,
    sellValue: 1,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  microchipX1: {
    name: "microchipX1",
    title: "Microship X-1",
    thumbnail: "microchipX1",
    description: 
    `Very low power requirements and cheap to produce, these disposable chips are as abundant as dirt was on Earth. Named after the famous blackhole Cygnus X-1.`,
    sellValue: 5,
    buyCost: 7,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  beaconAccessKey: {
    name: "beaconAccessKey",
    title: "Kaeso Beacon Access Key",
    thumbnail: "beaconAccessKey",
    description: 
    `Special device that allows access to the internals of an Ultraport beacon. Only works for a specific beacon.

    This one is configured for the exit beacon around planet Kaeso.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  electronicsShipment: {
    name: "electronicsShipment",
    title: "Electronics shipment",
    thumbnail: "electronicsShipment",
    description: 
    `Shipment of electronic parts. For confidential reasons the contents aren't disclosed on the box.`,
    sellValue: 50,
    blackSellValue: 150,
    buyCost: 75,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  forceFieldShields: {
    name: "forceFieldShields",
    title: "Force-field Shields",
    thumbnail: "forceFieldShields",
    description: 
    `These shields repel any object that gets close to it. It's not effective enough to stop projectiles but may prevent accidentally bumping into things.`,
    sellValue: 54,
    buyCost: 75,
    itemType: "shipSystem",
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  }
}