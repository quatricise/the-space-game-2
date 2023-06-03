data.quest = {
  theLostPrincess: {
    note: 
    `Summary:
    Livie Valois disappeared on March 13th 2675, 05:30. All evidence we have is a cruiser sighting and its approximate destination. 
    
    Plan:
    I reckon searching the locations within the trace radius one by one is the appropriate strategy. Starting with the dangerous solar systems might be my best bet until I can identify any traces of her ship. I don’t think any of the major players would risk a move like this, so this leaves us with the fanatic tribes of the outback, or perhaps the Hive.
    
    There’s too many questions waiting to be answered...`,
    options: [
      "Start looking for her in one of the destinations.",
      "Ask around carefully whether somebody's seen a crown cruiser, make up some excuse like a drug cartel investigation.",
      "",
    ]
  },
  outbackNegotiations: {
    note: 
    `Summary:
    A negotiation will be taking place on the topic of bordering communist and crown regions, and which government should take hold of those. Sensitive topic. Historically they were all autonomous regious until the crown took over and then the communist government formed swiftly within the next 20 years.
    
    Options:
    I don’t know for sure, information on this topic is scarce, I might need to poke around in the archives to find out more.

    [find in archive] 
    Poverty used to be a larger issue before the Crown, for sure, and as supply transports became more common so did the overall quality of life improve. However the regions are being exploited for resources.

    [reveals after first round of negotiations]
    `,
    options: [
      `Tank the negotiation by accident by revealing the existence of [some secret] crown documents.`,
      `Help argue Crown’s case that a central government will bring prosperity and unity to the regions.`,
      `Argue that neither government should take over and that the regions should be freed.`,
    ],
  },
  hiveArmsDeal: {
    note: 
    `Summary:
    The general assigned me as the Crown delegate on a mission to negotiate the purchase of some of the latest Hive technology such as ship-class weapons, personal weapons and a few experimental ship designs.
    I don’t think it’s a trap, they’d be really stupid to do that. I think I’ll go there first to find out more about the technology. Ideally bring aboard one of our top engineers to make sure we aren’t getting subpar products.
    
    Plan:
    Get Brady Cornell from Emna station, then travel to Hive main.`,
    options: [
      "",
      "",
    ]
  },
  piratesArrAProblem: {
    note: 
    `Summary:
    It’s another one of those annoying pirate hunts. I hate these. A new group of pirates took residence in the infamous octopus nebula, and apparently they had been attacking in the near systems.
    
    Plan:
    Get in, destroy their shit, get out. I wish there was some permanent solution to piracy, instead of having to play this relentless game of cat and mouse with them.`,
    options: [
      "",
      "",
    ]
  },
  waterTroubles: {
    note: 
    `Summary:
    The so called “WASP” tribe has been having a rough time with the Trader’s Union [TU], again, apparently... They had been spotted drilling deep wells on the planet in the main aquifer-rich regions, depriving the population of the much needed resource. Then they began selling the water back to the inhabitants. Very distasteful.
    
    I’m not sure how to approach this situation without completely sinking Crown’s tense relationship with TU. A covert sabotage could work. I just need to find the right people for the job. Cannot risk showing myself near the planet.
    
    I cannot tell what will come of this. Perhaps I can get these fanatics on the Crown’s side, or at least mine...`,
    options: [
      "",
      "",
    ]
  },
  governmentInfiltration: {
    note: 
    `Summary:
    The Hive wants to get their person inside the Communist government. I have to transport them to the capital and vouch for them in some way. His identity had been designed by entities smarter than me, so that is taken care of.
    
    The reason for this infiltration is not exactly clear to me, but I feel like I should play along and see what we can get out of this relationship. The Hive is probably playing its own game of 4D chess while the rest of us are stuck reading the manual.`,
    options: [
      "",
      "",
    ]
  },
  cobaltMinesBusiness: {
    note: 
    `Summary:
    Negotiate with the Naurw society of [some earth-like planet]. Apparently the Communists want to make peace with them to secure some resources on their planet.
    
    I’m rather convinced this is going to go poorly. What do I even offer to these people, they have a stable local economy and do not wish to mingle with the rest of the galaxy’s, especially all the bad TU business.
    
    I could try to swindle them somehow, but that could backfire quite horribly. Perhaps I can find something they’d be willing to trade for...`,
    options: [
      "",
      "",
    ]
  },
  pilgrimageMappingAssistance: {
    note: 
    `Summary:
    A group of religious pilgrims messaged me about helping them gather some satellite shots of terrain on Araen. Apparently there is a 20 000 m. tall mountain they’re planning to climb.
    
    These shots are difficult to take on Araen, mainly due to dust storms. But they must exist somewhere, maybe I can bribe my way to some photos or scans from the weather committee surveying this region of space.
    
    What’s in this for me? Maybe nothing, but time will tell.`,
    options: [
      "",
      "",
    ]
  },
  hereComesTheGun: {
    note: 
    `Summary:
    Fanatic leader of an outback colony prophesizes the coming of a great gun to shoot everyone at the end of the world; to punish us for our trespasses, or something. The guy’s nuts. Trouble is, his followers are causing trouble on the planet and it’s putting TU on the edge. One of their large freighters got scratched by a rogue missile and now they refuse to send another aid shipment there until the situation calms.
    
    There is little reason I would have to engage in this, but maybe I can help somehow. If it helps the Crown's standing with TU, then it's well worth it.`,
    options: [
      "",
      "",
    ]
  },
  questStructure: {
    note: ``,
    factionsInvolved: [
      "crown",
      "communist",
      "outback",
      "alliance",
      "hive",
      "tradersUnion",
    ],
    options: [
      "",
      "",
    ],
    startingLocation: {
      system: "Some system",
      planet: "Some planet"
    },
    trigger: {
      method: "dialogue",
      dialogueOption: ""
    },
    treeRef: "questTree0"
  },
}

/* this is a rough idea of how the quest branching could work */
data.interactionSets = {
  theLostPrincessBranch0: [
    "someInteractionId0",
    "someInteractionId1",
    "someInteractionId2",
  ]
}