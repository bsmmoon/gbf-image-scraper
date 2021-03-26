const fs = require('fs')

let progress = 0
let links = []
fs.readFile("./progress.json", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  progress = JSON.parse(data).current

  fs.readFile("./npc.json", "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    links = JSON.parse(data).links
    
    console.log(`Progress: ${progress} / ${links.length}`)
  })
})



