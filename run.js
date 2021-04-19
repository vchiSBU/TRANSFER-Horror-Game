let fs = require('fs')
let spawn = require('child_process').exec

let checkIfDirectory = (directory, file) => {
    return fs.statSync(`${directory}/${file}`).isDirectory()
}

let installFiles = (location) => {
    spawn(`cd ${location} && npm install`, (err, stdout, stderr) => {
        if (err) {console.error(`Exec error: ${err}`); return}
    })
}

let run = (directory) => {
    try {
        if (!fs.statSync(directory).isDirectory()) return;
    }catch{
        return;
    }
    let encompassingDirectory = fs.readdirSync(directory)
    encompassingDirectory.map((file) => {
        if (checkIfDirectory(directory, file)) {
            console.log(`${directory}/${file}`)
            installFiles(`${directory}/${file}`)
        }
    })
}

run('./public')