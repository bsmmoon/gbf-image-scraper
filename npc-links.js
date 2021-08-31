/*
 * Output Format:
    {
      "NPC": {
        "3050000000": "Lyria",
        "3050001000": "Vyrn",
      }
    } 
 *
 */
const preprocessLines = lines => lines
  .join("</tr>")
  .split("<tr")
  .map(row => row
    .split("\" title=")[0]
    .split("a href=\"")[1]
  )
  .filter(e => !!e)

const https = require("https")
const URL = "https://gbf.wiki/NPC_Characters_List"
https.get(URL, (resp) => {
  let result = []
  let lines = []
  let carryOver = ""
  resp.on("data", chunk => {
    lines = (carryOver + chunk).split("</tr>")
    carryOver = lines.pop()
    result = result.concat(preprocessLines(lines))
  })

  resp.on("end", _ => {
    lines = [carryOver]
    result = result.concat(preprocessLines(lines))
    result.pop() // lazy way to handle text after table

    // Print the end result
    console.log(JSON.stringify({links: result}, null, 2))
  })

  resp.on("error", err => console.log(`Error: ${err.message}`))
})
