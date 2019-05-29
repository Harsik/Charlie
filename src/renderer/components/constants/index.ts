export const API_BASE_URL = 'http://localhost:8080/api'
export const ACCESS_TOKEN = 'accessToken'

export const POLL_LIST_SIZE = 30
export const MAX_CHOICES = 6
export const POLL_QUESTION_MAX_LENGTH = 140
export const POLL_CHOICE_MAX_LENGTH = 40

export const NAME_MIN_LENGTH = 4
export const NAME_MAX_LENGTH = 40

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 15

export const EMAIL_MAX_LENGTH = 40

export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_MAX_LENGTH = 20
// const { BrowserWindow } = require('electron')
      // let win = new BrowserWindow()
      // win.webContents.session.on('will-download', (event, item, webContents) => {
      // // Set the save path, making Electron not to prompt a save dialog.
      //   item.setSavePath('/tmp/save.pdf')

      //   item.on('updated', (event, state) => {
      //     if (state === 'interrupted') {
      //       console.log('Download is interrupted but can be resumed')
      //     } else if (state === 'progressing') {
      //       if (item.isPaused()) {
      //         console.log('Download is paused')
      //       } else {
      //         console.log(`Received bytes: ${item.getReceivedBytes()}`)
      //       }
      //     }
      //   })
      //   item.once('done', (event, state) => {
      //     if (state === 'completed') {
      //       console.log('Download successfully')
      //     } else {
      //       console.log(`Download failed: ${state}`)
      //     }
      //   })
      // })
      // fileName = this.selected[0].name
      // const {BrowserWindow} = require('electron')
      // const {download} = require('electron-dl')
      // let win = new BrowserWindow()
      // const url = 'http://localhost:8080/api/file/deleteFile?fileName=' + fileName
      // download(win.getFocusedWindow(), url)