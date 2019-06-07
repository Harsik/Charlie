<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm12 md12>
      <v-toolbar flat color="white">
        <v-toolbar-title>FileList</v-toolbar-title>
      </v-toolbar>
      <v-card class="pa-3">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="files"
          :search="search"
          item-key="name"
          select-all
          class="elevation-1"
        >
          <!-- hide-actions
          :pagination.sync='pagination'-->
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template v-slot:items="props">
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.size }}</td>
            <td>{{ props.item.updatedAt }}</td>
            <td class="align-center justify-start layout px-0">
              <v-icon small @click="deleteFile(props.item.name)">delete</v-icon>
            </td>
          </template>
          <!-- <template v-slot:no-results>
        <v-alert :value='true' color='error' icon='warning'>
          Your search for '{{ search }}' found no results.
        </v-alert>
          </template>-->
        </v-data-table>
        <!-- <div class='text-xs-center pt-2'>
          <v-pagination v-model='pagination.page' :length='pages'></v-pagination>
        </div>-->
        <v-btn raised class="primary" @click="onPickFile">Upload</v-btn>
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="*"
          @change="onFilePicked"
          multiple
          required
        >
        <v-btn raised class="primary" @click="ondownloadFiles">Download</v-btn>
        <!-- <v-btn raised class="primary" @click="ondownloadFiles">Download Folder</v-btn> -->
        <v-progress-circular v-if="isDownloading" indeterminate></v-progress-circular>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// let isDownloading = false
// const request = require('request')
const http = require('http')
const fs = require('fs')

function download (url, name) {
  // TODO: check if url is duplicated. Sometimes
  // OpenSubtitles is returning wrong sub in a TV Show
  // console.log(url, name)
  const file = fs.createWriteStream(name)
  return new Promise(resolve => {
    http.get(url, response => {
      // console.log(response)
      response.pipe(file)
      // console.log(resolve)
      resolve('ready')
    })
  })
  // .then(response => {
  //   console.log(response)
  //   this.isDownloading = false
  //   this.downloadAlarm()
  // })
  //   .catch(error => {
  //     this.isDownloading = false
  //     console.log(error)
  //     this.errorAlarm()
  //   })
}
export default {
  name: 'FileList',
  data: () => ({
    totalBytes: 0,
    receivedBytes: 0,
    isDownloading: false,
    search: '',
    pagination: {
      // descending: true,
      // page: 1,
      // rowsPerPage: 4,
      // totalItems: 0,
      // rowsPerPageItems: [1, 2, 4, 8, 16],
      sortBy: 'updatedAt'
    },
    selected: [],
    files: [],
    headers: [
      {
        text: 'FileName',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Type', value: 'type' },
      { text: 'Size', value: 'size' },
      { text: 'UpdatedAt', value: 'updatedAt' },
      { text: '', value: '' }
    ]
  }),
  mounted () {
    this.loadFiles()
  },
  computed: {
    pages () {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        return 0
      }
      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      )
    }
  },
  methods: {
    download (url, name) {
      // TODO: check if url is duplicated. Sometimes
      // OpenSubtitles is returning wrong sub in a TV Show
      // console.log(url, name)
      const file = fs.createWriteStream(name)
      return new Promise(resolve => {
        http.get(url, response => {
          // console.log(response)
          response.pipe(file)
          // console.log(resolve)
          resolve('ready')
        })
      })
    },
    showProgress (received, total) {
      const percentage = (received * 100) / total
      console.log(
        percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.'
      )
    },
    ondownloadFiles () {
      this.isDownloading = true
      this.selected.forEach(function (value, key) {
        // console.log(value.name)
        const fileName = value.name
        let url = 'http://localhost:8080/api/file/downloadFile?' + fileName
        let name = 'C:/Users/Achivsoft/Downloads/' + fileName
        // const file = fs.createWriteStream(name)

        download(url, name).then(function (e) {
          console.log(e)
          // this.isDownloading = false
          // this.downloadAlarm()
        })
        // return new Promise(resolve => {
        //   http.get(url, response => {
        //     // console.log(response)
        //     response.pipe(file)
        //     // response.on('response', (data) => {
        //     //   this.totalBytes = parseInt(data.headers['content-length'])
        //     //   console.log(this.totalBytes)
        //     // })
        //     // .on('data', (chunk) => {
        //     //   this.receivedBytes += chunk.length
        //     //   this.showProgress(this.receivedBytes, this.totalBytes)
        //     // }).on('end', () => {
        //     //   this.isDownloading = false
        //     //   this.downloadAlarm()
        //     // })
        //   })
        // })
        // .then(response => {
        //   console.log(response)
        //   this.isDownloading = false
        //   this.downloadAlarm()
        // })
        // .catch(error => {
        //   this.isDownloading = false
        //   console.log(error)
        //   this.errorAlarm()
        // })
      })
      // this.isDownloading = false
      // this.downloadAlarm()
      // const { shell } = require('electron') // deconstructing assignment

      // shell.openItem('filepath')
      // shell.openItem('C:/Users/Achivsoft/Downloads/')
      // shell.showItemInFolder('C:/Users/Achivsoft/Downloads/')
    },
    deleteFile (fileName) {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/deleteFile?fileName=' + fileName, {
        method: 'GET',
        headers: headers
      })
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.loadFiles()
          })
        )
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    uploadFile (file) {
      let formData = new FormData()
      formData.append('file', file)
      const headers = new Headers({
        // 'Content-Type': 'multipart/form-data'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/uploadFile', {
        method: 'POST',
        headers: headers,
        body: formData
      })
        .then(response => {
          this.loadFiles()
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    uploadFiles (files) {
      let formData = new FormData()
      for (let file in files) {
        formData.append('files', files[file])
      }
      const headers = new Headers({
        // 'Content-Type': 'multipart/form-data'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/uploadMultipleFiles', {
        method: 'POST',
        headers: headers,
        body: formData
      })
        .then(response => {
          this.loadFiles()
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onFilePicked (event) {
      const files = event.target.files // file info load

      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please pick valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.uploadFiles(files)
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    loadFiles () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/loadFiles', {
        method: 'POST',
        headers: headers
      })
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.files = json
          })
        )
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    downloadAlarm () {
      const set = { color: 'success', text: 'Download Complete' }
      this.$emit('setSnackbar', set)
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
