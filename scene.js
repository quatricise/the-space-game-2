class Location {
  constructor(identifier) {
    this.name = identifier
    this.objects = []
    this.facts = {
      burger_shop_nearby: true,
      has_angered_shopkeeper: false,
    }
    this.globals = {
      background: "some background object"
    }
  }
  send_object(destination = "scene string identifier", object) {
    destination.receive(object)
    this.removeObject(object)
  }
  send_fact(destination = "scene string identifier", fact) {
    destination.receive(fact)
  }
  removeObject(object) {
    this.objects.splice(this.objects.indexOf(object), 1)
  }
  receive_fact() {

  }
}

//make scenes share and send data like ships with characters, 

//also some facts will be local to any scene, like the fact you murdered a dozen civilians
//by accident, but they may spread through various methods in class NPC or something


//todo put this in data once i know what i want
data.backgrounds = {
  tauri_b: {
    image: "assets/backgrounds/tauri_b.png",
  },
}