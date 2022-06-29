let sources = {
  img: {
    // "debug_ship": {
    //   thumbnail: {
    //     src: "assets/ship_crown_large/thumbnail.png",
    //   },
    //   glow: {
    //     src: "assets/ship_crown_large/glow.png",
    //   },
    //   // flame: {
    //   //   src: "assets/ship_crown_large/flame.png",
    //   // },
    //   animated_flame_0: {
    //     src: "assets/ship_crown_large/flame/flame_0000.png",
    //     length: 3,
    //   },
    //   fill: {
    //     src: "assets/ship_crown_large/fill.png",
    //   },
    //   highlights_0: {
    //     src: "assets/ship_crown_large/highlights_0.png",
    //   },
    //   highlights_90: {
    //     src: "assets/ship_crown_large/highlights_90.png",
    //   },
    //   highlights_180: {
    //     src: "assets/ship_crown_large/highlights_180.png",
    //   },
    //   highlights_270: {
    //     src: "assets/ship_crown_large/highlights_270.png",
    //   }, 
    //   animated_lights_0: {
    //     src: "assets/ship_crown_large/anim_lights_blue_1/ship_the_crown0000.png",
    //     length: 31,
    //   },
    //   lights_overlay: {
    //     src: "assets/ship_crown_large/lights_overlay.png",
    //   },
    //   linework: {
    //     src: "assets/ship_crown_large/linework.png",
    //   },
    //   shield: {
    //     src: "assets/ship_crown_large/shield.png",
    //   },
    // },
    "bluebird_needle": {
      folder: "assets/bluebird_needle/",
      auto: [
        "thumbnail",
        "glow",
        // "flame3",
        "ghost",
        "fill",
        "highlights",
        "linework",
        "skip5",
      ],
      // animated_flame_0: {
      //   src: "flame_0000.png",
      //   length: 3,
      // },
      // thumbnail: {
      //   src: "thumbnail.png",
      // },
      // fill: {
      //   src: "fill.png",
      // },
      // highlights_0: {
      //   src: "highlights_0.png",
      // },
      // highlights_90: {
      //   src: "highlights_90.png",
      // },
      // highlights_180: {
      //   src: "highlights_180.png",
      // },
      // highlights_270: {
      //   src: "highlights_270.png",
      // }, 
      // linework: {
      //   src: "linework.png",
      // },
    },
    "crimson_fighter": {
      folder: "assets/crimson_league_elite_fighter_smaller/",
      auto: [
        "thumbnail",
        "glow",
        "fill",
        "highlights",
        "linework",
      ],
      // thumbnail: {
      //   src: "assets/crimson_league_elite_fighter_smaller/thumbnail.png",
      // },
      // glow: {
      //   src: "assets/crimson_league_elite_fighter_smaller/glow.png",
      // },
      // // flame: {
      // //   src: "assets/ship_crown_large/flame.png",
      // // },
      // fill: {
      //   src: "assets/crimson_league_elite_fighter_smaller/fill.png",
      // },
      // highlights_0: {
      //   src: "assets/crimson_league_elite_fighter_smaller/highlights_0.png",
      // },
      // highlights_90: {
      //   src: "assets/crimson_league_elite_fighter_smaller/highlights_90.png",
      // },
      // highlights_180: {
      //   src: "assets/crimson_league_elite_fighter_smaller/highlights_180.png",
      // },
      // highlights_270: {
      //   src: "assets/crimson_league_elite_fighter_smaller/highlights_270.png",
      // },
      // linework: {
      //   src: "assets/crimson_league_elite_fighter_smaller/linework.png",
      // },
    },
    "crimson_fighter_big": {
      thumbnail: {
        src: "assets/crimson_league_elite_fighter/thumbnail.png",
      },
      glow: {
        src: "assets/crimson_league_elite_fighter/glow.png",
      },
      // flame: {
      //   src: "assets/ship_crown_large/flame.png",
      // },
      fill: {
        src: "assets/crimson_league_elite_fighter/fill.png",
      },
      highlights_0: {
        src: "assets/crimson_league_elite_fighter/highlights_0.png",
      },
      highlights_90: {
        src: "assets/crimson_league_elite_fighter/highlights_90.png",
      },
      highlights_180: {
        src: "assets/crimson_league_elite_fighter/highlights_180.png",
      },
      highlights_270: {
        src: "assets/crimson_league_elite_fighter/highlights_270.png",
      },
      linework: {
        src: "assets/crimson_league_elite_fighter/linework.png",
      },
    },
    stations: {
      "crimson": {
        folder: "assets/crimson_league_station/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "lights",
          "lights_overlay",
          "linework",
        ],
        // thumbnail: {
        //   src: "assets/crimson_league_station/thumbnail.png",
        // },
        // fill: {
        //   src: "assets/crimson_league_station/fill.png",
        // },
        // highlights_0: {
        //   src: "assets/crimson_league_station/highlights_0.png",
        // },
        // highlights_90: {
        //   src: "assets/crimson_league_station/highlights_90.png",
        // },
        // highlights_180: {
        //   src: "assets/crimson_league_station/highlights_180.png",
        // },
        // highlights_270: {
        //   src: "assets/crimson_league_station/highlights_270.png",
        // }, 
        // lights: {
        //   src: "assets/crimson_league_station/lights.png",
        // },
        // lights_overlay: {
        //   src: "assets/crimson_league_station/lights_overlay.png",
        // },
        // linework: {
        //   src: "assets/crimson_league_station/linework.png",
        // },
      }
    },
    asteroids: {
      medium_0: {
        folder: "assets/asteroids/medium_0/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
      medium_1: {
        folder: "assets/asteroids/medium_1/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
      small_0: {
        folder: "assets/asteroids/small_0/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
      small_1: {
        folder: "assets/asteroids/small_1/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
      debris_0: {
        folder: "assets/debris/generic_0/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
    }
  },
  audio: {

  },
}