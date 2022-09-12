const facts = []; 
readTextFile("data/facts/facts.json", function(text) {
  let f = JSON.parse(text)
  f.forEach(f => facts.push(f))
})



//so the dialogue with the highest number of specific requirements from any given set of options
//will be triggered

//each "criterion" will have an importance rating, and it will override any number or at least
//an equal number of less important facts
