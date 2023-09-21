class DialogueData {
  constructor(header, nodes = []) {
    this.header = header ?? {
      name: "Dialogue name",
      description: "Description",
      sections: new Set()
    }
    this.nodes = nodes
  }
}