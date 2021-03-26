/*
 * Output Format:
    {
      "R": {
        "3020016000": "Mary"
      },
      "SR": {
        "3030019000": "Vira"
      },
      "SSR": {
        "3040040000": "Jeanne d'Arc",
        "3040053000": "Vira (Summer)",
        "3040081000": "Korwa"
      }
    } 
 *
 */

const convertToJSON = result => {
  let obj = {}
  result
    .sort((a, b) => a[0] > a[1])
    .forEach(entry => {
      let [id, category, name] = entry
      if (!obj[category]) obj[category] = {}
      id = `30${id.slice(0, 1)}0${id.slice(1)}000`
      obj[category][id] = name
    })
  return JSON.stringify(obj, null, 2)
}

const preprocessLines = lines => lines
  .join("")
  .split("<tr")
  .map(row => row
    .split("</td>")
    .slice(0, 3)
    .map(col => {
      let tokens = col
        .replace("</a>", "")
        .split(">")
      return tokens[tokens.length - 1].trim()
    })
    .filter(col => col.length > 0)
  )
  .filter(row => row.length === 3)

const https = require("https")
const URL = "https://gbf.wiki/All_Characters"
https.get(URL, (resp) => {
  let result = []
  let lines = []
  let carryOver = ""
  resp.on("data", chunk => {
    lines = (carryOver + chunk).split("\n")
    carryOver = lines.pop()
    result = result.concat(preprocessLines(lines))
  })

  resp.on("end", _ => {
    lines = [carryOver]
    result = result.concat(preprocessLines(lines))
    console.log(convertToJSON(result))
  })

  resp.on("error", err => console.log(`Error: ${err.message}`))
})

