let facts = [
  {
    player_currency: 20,
    reference: {
      object: "player",
      property: "currency"
    },
    update() {
      this.player_currency = this.reference.object[this.reference.property]
    }
  }
]
