class Scene {
  constructor(location) {
    this.objects = []
    this.facts = {
      burger_shop_nearby: true,
      has_angered_shopkeeper: false,
    }
    this.globals = {
      background: "some background object"
    }
  }
  send_object(destination = "class Scene", object) {
    destination.receive(object)
    this.removeObject(object)
  }
  send_fact(destination = "class Scene", object) {
    destination.receive(object)
  }
  removeObject(object) {
    this.objects.splice(this.objects.indexOf(object), 1)
  }
}

//make scenes share and send data like ships with characters, 

//also some facts will be local to any scene, like the fact you murdered a dozen civilians
//by accident, but they may spread through various methods in class NPC or something


//todo put this in data once i know what i want
let backgrounds = {
  tauri_b: {
    image: "assets/backgrounds/tauri_b.png",
  },
}