class UI {
  constructor() {
    this.menus = {
      start: {
        open: false,
      },
      options: {
        open: false,
      },
      dialogue: {
        open: false,
      },
      inventory: {
        open: false,
      },
      ship: {
        open: false,
      },
    },
    this.overlays = {
      top_left: {
        pos: {
          x: 20,
          y: 25
        },
        items: [
          {
            name: "ship_hull",
            value: 10
          },
          {
            name: "reactor_power",
            value: 10
          },
          {
            name: "currency",
            value: 10
          },
          {
            name: "dash_timer",
            value: 10
          },
          {
            name: "location",
            value: 10
          },
        ]
      }
    }
  }

}

const ui = new UI()