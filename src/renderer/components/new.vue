<template></template>

<script>
const { BrowserWindow } = require('electron')
let win = new BrowserWindow()
win.webContents.session.on('will-download', (event, item, webContents) => {
  // Set the save path, making Electron not to prompt a save dialog.
  item.setSavePath('/tmp/save.pdf')

  item.on('updated', (event, state) => {
    if (state === 'interrupted') {
      console.log('Download is interrupted but can be resumed')
    } else if (state === 'progressing') {
      if (item.isPaused()) {
        console.log('Download is paused')
      } else {
        console.log(`Received bytes: ${item.getReceivedBytes()}`)
      }
    }
  })
  item.once('done', (event, state) => {
    if (state === 'completed') {
      console.log('Download successfully')
    } else {
      console.log(`Download failed: ${state}`)
    }
  })
})
 downloadFile(file_url , targetPath) {
    // Save variable to know progress
    const received_bytes = 0
    const total_bytes = 0

    const req = request({
        method: 'GET',
        uri: file_url
    })

    const out = fs.createWriteStream(targetPath)
    req.pipe(out)

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length' ])
    })

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length

        showProgress(received_bytes, total_bytes)
    })

    req.on('end', function() {
        alert('File succesfully downloaded')
    })
}
showProgress(received,total) {
    var percentage = (received * 100) / total
    console.log(percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.')
}
</script>
