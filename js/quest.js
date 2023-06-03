class Quest {
  static beginQuest(quest) {
    if(this.finished.findChild(quest)) return

    this.active.push(quest)
  }
  static endQuest(quest) {
    if(this.finished.findChild(quest)) return
    if(!this.active.findChild(quest)) return

    this.active.remove(quest)
    this.finished.push(quest)
  }
  static active = []
  static finished = []
}