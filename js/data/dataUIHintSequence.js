data.UIHintSequence = {
  inventory: {
    finished: false,
    hintSequence: [
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This is the Inventory.",
        text: 
        `It has three tabs: <b>Inventory, Station and Quests</b>. 
        <br>
        Let's quickly go over them.
        <br><br><br>
        ~bind=forwardSequence~ <b>Continue</b>&nbsp;&nbsp;&nbsp;~bind=cancel~ <b>Cancel hint</b>.
        </b>
        `,
        actions: []
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the player inventory.",
        text: 
        `Here you can manage your ship's ~highlight=weapons~ and inspect or sell ~highlight=items~. 
        <br><br>
        ~highlight=Selling items is only available when docked in a station~.`,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-inventory"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the station interface.",
        text: 
        `Here you can ~highlight=purchase~ things or ~highlight=upgrade~ your ship.
        <br><br>
        This tab is ~highlight=only accessible when you dock into a station~. If the icon is grayed out, it means it isn't available.
        `,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-station"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the Journal.",
        text:
        `Inside you find info about your ~highlight=current quests~. 
        <br><br>
        When you start a new quest, a journal entry will be created for it.
        <br><br>
        Progressing on a quest will ~highlight=update its description~. You can check your journal anytime you're not sure what to do, and need a hint.
        `,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-quest"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "Tour over",
        text:
        `That's it, now go buy some weapons.`,
        actions: []
      },
    ]
  },
  map: {
    finished: false,
    hintSequence: [
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=This is the Galaxy map~",
        text: 
        `Here you can see the entire breadth of the game's world.
        <br><br><br>
        ~bind=forwardSequence~&nbsp;<b>Take tour</b>&nbsp;&nbsp;&nbsp;~bind=cancel~&nbsp;<b>Cancel tour</b>.
        `,
        actions: []
      },
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=Territories~",
        text: 
        `The map is divided into ~highlight=territories~.
        <br><br>
        Each territory is controlled by a somewhat independent government.
        <br><br>
        You're free to travel all places marked by ~white=white~ icons, ~white=without spending fuel~.
        <br><br>
        All ~highlight=outback~ (orange) icons cost ~highlight=1 unit of heavy fuel~ to travel there.
        `,
        actions: []
      },
      {
        parentElementId: "map-legend-button",
        hintPlacement: "top",
        options: {
          useBackground: true,
          allowPointerEvents: true,
        },
        title: "~larger=Legend~",
        text: 
        `At last, you can view the ~highlight=map legend~ here if you need it.`,
        actions: [
          {
            actionName: "addClass",
            elementId:  "map-legend-button",
            classes: ["active"]
          },
        ]
      },
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=That's all folks~",
        text: 
        `The map tour hours are over.`,
        actions: [
          {
            actionName: "removeClass",
            elementId:  "map-legend-button",
            classes: ["active"]
          },
        ]
      },
    ]
  }
}