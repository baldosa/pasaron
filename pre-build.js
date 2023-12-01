const fs = require('fs')
const moment = require('moment');
const { createCanvas, Image  } = require('canvas')

// date calculation
let fromDate = moment("2023-11-19", "YYYY-MM-DD")
let toDate = moment("2027-12-10", "YYYY-MM-DD")
let totalDays = toDate.diff(fromDate, "days")
let missingDays = toDate.diff(moment(), "days") + 1
let diffDays = totalDays - missingDays

let fullDays = Math.floor(diffDays / 5)
let remainderDays = diffDays % 5

// index.html generation
textVal = `---
layout: base
fullDays: ${fullDays}
remainderDays: ${remainderDays}
missingDays: ${missingDays}
diffDays: ${diffDays}
---`
fs.writeFileSync('src/index.html', textVal, 'utf8')


// screenshot.png generator
const out = fs.createWriteStream(__dirname + '/src/capture.png')
const canvas = createCanvas(400, 400)
const stream = canvas.createPNGStream()
const ctx = canvas.getContext('2d')
ctx.fillStyle = "white";

ctx.fillRect(0, 0, 400, 400);

function loadImage(size, x, y) {
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.onerror = err => { throw err }
    img.src = `src/img/${size}.png`
    ctx.drawImage(img, x, y)
  }

for (let step = 0; step < fullDays; step++) {
    loadImage(5, step*98, step)
  }
if (remainderDays > 0) {
    loadImage(remainderDays, fullDays*98, remainderDays)
}


ctx.font = '35px Roboto'
ctx.fillStyle = "black";

ctx.fillText(`Ya pasaron ${diffDays} días
             faltan ${missingDays}`, 10, 250)



stream.pipe(out)
