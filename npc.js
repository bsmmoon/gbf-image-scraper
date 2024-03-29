const https = require("https")

const TITLE_PREFIX = '<h1 id="firstHeading" class="firstHeading" lang="en">'
const TITLE_SUFFIX = '</h1>'

const findTitle = (lines) => {
  for (let line of lines) {
    tokens = line.split(TITLE_PREFIX)
    if (!tokens[1]) continue

    return tokens[1].split(TITLE_SUFFIX)[0]
  }
}

const ID_PREV = '<th>ID</th>'
const ID_PREFIX = '<td>'
const ID_SUFFIX = '</td>'
const findId = (lines) => {
  let flag = false
  for (let line of lines) {
    if (!flag) {
      flag = line.trim() === ID_PREV
      continue
    }
    return line.split(ID_PREFIX)[1].split(ID_SUFFIX)[0]
  }
}

const scrapPage = page => {
  const URL = `https://gbf.wiki${page}`
  const LIMIT = 500
  https.get(URL, (resp) => {
    let lines = []
    let carryOver = ""
    resp.on("data", chunk => {
      if (lines.length > LIMIT) return

      lines = lines.concat((carryOver + chunk).split("\n"))
      carryOver = lines.pop()
    })

    resp.on("end", () => {
      let title = findTitle(lines)
      let id = findId(lines)
      console.log(page, title, id)
    })

    resp.on("error", err => console.log(`Error: ${err.message}`))
  })
}


const fs = require('fs')

let progress = 0
let links = []
fs.readFile("./progress.json", "utf8", (err, data) => {
  if (err) {
    progress = 0
  } else {
    progress = JSON.parse(data).current
  }

  fs.readFile("./npc-links.json", "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    links = JSON.parse(data).links
    
    console.log(`Progress: ${progress} / ${links.length}`)

    for (progress in links) {
      scrapPage(links[progress])
      setTimeout(() => {}, 2000)
    }
  })
})
