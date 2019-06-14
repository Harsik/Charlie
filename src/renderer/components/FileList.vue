<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm12 md12>
      <v-card class="pa-3">
        <v-toolbar flat color="white">
          <v-toolbar-title>FileList</v-toolbar-title>
        </v-toolbar>
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
              <v-icon small @click="onDeleteFile(props.item.name)">delete</v-icon>
            </td>
          </template>
        </v-data-table>
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
        <v-btn raised class="primary" @click="onDownloadFiles" :disabled="isDownloading">Download</v-btn>
        <v-btn raised class="primary" @click="openDownloadFolder">Folder</v-btn>
        <v-progress-circular v-if="isDownloading" transition="fade-transition" indeterminate></v-progress-circular>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { deleteFile, uploadFile, uploadFiles, loadFiles } from './APIUtils'
import { ipcRenderer, shell } from 'electron'

export default {
  name: 'FileList',
  data: () => ({
    totalBytes: 0,
    receivedBytes: 0,
    isDownloading: false,
    search: '',
    pagination: {
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
    this.onLoadFiles()
    this.setDownloadProgressEvent()
  },
  methods: {
    setDownloadProgressEvent () {
      ipcRenderer.on('download progress', (event, progress) => {
        // console.log(progress) // Progress in fraction, between 0 and 1
        // const progressInPercentages = progress * 100 // With decimal point and a bunch of numbers
        let cleanProgressInPercentages = Math.floor(progress * 100) // Without decimal point
        if (cleanProgressInPercentages === 100) {
          this.isDownloading = false
        } else {
          this.isDownloading = true
        }
      })
    },
    openDownloadFolder () {
      shell.showItemInFolder('C:/Users/Achivsoft/Downloads/*')
    },
    onDownloadFiles () {
      for (let value of this.selected) {
        this.isDownloading = true
        const fileName = value.name
        let url = 'http://localhost:8080/api/file/downloadFile/' + fileName
        let dir = 'C:/Users/Achivsoft/Downloads'
        ipcRenderer.send('download', {
          url: url,
          properties: { directory: dir, filename: fileName }
        })
      }
    },
    onDeleteFile (fileName) {
      deleteFile(fileName)
        .then(response => {
          this.onLoadFiles()
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onUploadFile (file) {
      let formData = new FormData()
      formData.append('file', file)
      uploadFile(formData)
        .then(response => {
          this.onLoadFiles()
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onUploadFiles (files) {
      let formData = new FormData()
      for (let file in files) {
        formData.append('files', files[file])
      }
      uploadFiles(formData)
        .then(response => {
          this.onLoadFiles()
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
      this.onUploadFiles(files)
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onLoadFiles () {
      loadFiles()
        .then(response => {
          this.files = response
        })
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
