

var path = 'D:/';
var fs = require('fs');

function diskFoundRootFiles() {
    //for file in os.listdir(path):
    //console.log('\t', file)
}


function diskFoundAllFiles() {
    /*for basename, dirnames, files in os.walk(path):
        for file in files:
            console.log('\t', file)*/
}


exports.serverConnection = function () {

    var found = false;
    if (fs.existsSync(path)) found = true
    if (!found) {
        console.log("\nNo Disk Found.\nListening to USB ports...")
        while (true) {
            found = false
            if (fs.existsSync(path)) {
                found = true
            }
            if (found) {
                console.log('-' * 60)
                break
            }
        }
    }
    else {
        console.log('\nDisk Found: Disk D\nCONTENTS::')
        diskFoundRootFiles()
        while (true) {
            found = false
            if (fs.existsSync(path)) {
                found = true
            }
            if (!found) {
                console.log('-' * 60)
                break
            }
        }
    }


}


