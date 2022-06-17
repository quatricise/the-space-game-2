class Room {
  constructor() {
    this.objects = {
      stations: {},
      asteroids: {},
      ships: {},
      debris: {},
      get rigid() {
        return [this.ships, this.asteroids, this.stations, this.debris]
      }
    }
    this.background = {
      background_color: "hsl()",
      stars: {
        colors: [
            {
              value: "hsl()",
              weight: 40
          },
            {
              value: "hsl()",
              weight: 30
          },
            {
              value: "hsl()",
              weight: 30
          },
        ],
        density: 9000, //per grid cell??
      },
      objects: {
        static: [],
        dynamic: [
        {
          pos: {
            x: 0,
            y: 0
          },
          parallax: 0.5, //object translate is multiplied by this value
          sprite: {
            src: "",
            dim: {
              x: 0,
              y: 0
            }
          }
        }
        ],
      }
    }
  }
}

console.log("Don't use class_room.js, use class_scene.js")