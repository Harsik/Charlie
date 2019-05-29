<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm12 md12>
      <v-toolbar flat color='white'>
        <v-toolbar-title>FileList</v-toolbar-title>
      </v-toolbar>
      <v-card class='pa-3'>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model='search'
            append-icon='search'
            label='Search'
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-model='selected'
          :headers='headers'
          :items='files'
          :search='search'
          item-key='name'
          select-all
          class='elevation-1'
        >
          <!-- hide-actions
          :pagination.sync='pagination'-->
          <v-progress-linear v-slot:progress color='blue' indeterminate></v-progress-linear>
          <template v-slot:items='props'>
            <td>
              <v-checkbox v-model='props.selected' primary hide-details></v-checkbox>
            </td>
            <td>
              <a v-bind:href='props.item.downloadUri' download>{{ props.item.name }}</a>
            </td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.size }}</td>
            <td>{{ props.item.updatedAt }}</td>
            <td class='align-center justify-start layout px-0'>
              <v-icon small @click='deleteFile(props.item.name)'>delete</v-icon>
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
        <v-btn raised class='primary' @click='onPickFile'>Upload</v-btn>
        <input
          type='file'
          style='display: none'
          ref='fileInput'
          accept='*'
          @change='onFilePicked'
          multiple
          required
        >
        <v-btn raised class='primary' @click='ondownloadFile'>Download</v-btn>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const request = require('request')
const fs = require('fs')
export default {
  name: 'FileList',
  data: () => ({
    loading: false,
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
    showProgress (received, total) {
      const percentage = (received * 100) / total
      console.log(
        percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.'
      )
    },
    downloadFile (fileUrl, targetPath) {
      // Save variable to know progress
      let receivedBytes = 0
      let totalBytes = 0

      const req = request({
        method: 'GET',
        uri: fileUrl
      })

      const out = fs.createWriteStream(targetPath)
      req.pipe(out)

      req.on('response', function (data) {
        // Change the total bytes value to get progress later.
        totalBytes = parseInt(data.headers['content-length'])
      })

      req.on('data', function (chunk) {
        // Update the received bytes
        receivedBytes += chunk.length

        this.showProgress(receivedBytes, totalBytes)
      })

      req.on('end', function () {
        alert('File succesfully downloaded')
      })
    },
    ondownloadFiles () {
      this.selected.forEach(function (value, key) {
        console.log(value)
        this.downloadFile(value.name)
      })
    },
    ondownloadFile (fileName) {
      fileName = this.selected[0].name
      const url =
        'http://localhost:8080/api/file/deleteFile?fileName=' + fileName
      const dir = '/downloads/' + fileName
      this.downloadFile(url, dir)
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
      // for (var index = 0 index < files.length index++) {
      //   formData.append('files', files[index])
      // }
      // files.forEach(function (value, key) {  //not function
      //   formData.append('files', files[key])
      //   formData.append('files', value)
      // })
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
      // this.uploadFile(files[0])
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
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
