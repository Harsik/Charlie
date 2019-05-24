<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm12 md12>
      <v-toolbar flat color='white'>
        <v-toolbar-title>FileList</v-toolbar-title>
      </v-toolbar>
      <v-card class='pa-3'>
        <v-data-table :headers='headers' :items='files' class='elevation-1'>
          <template v-slot:items='props'>
            <td>{{ props.item.name }}</td>
            <td class='text-xs-right'>{{ props.item.name }}</td>
            <td class='text-xs-right'>{{ props.item.downloadUri }}</td>
            <td class='text-xs-right'>{{ props.item.type }}</td>
            <td class='text-xs-right'>{{ props.item.created_at }}</td>
            <td class='text-xs-right'>{{ props.item.updated_at }}</td>
          </template>
        </v-data-table>
        <v-btn raised class='primary' @click='onPickFile'>Upload</v-btn>
        <input
          type='file'
          style='display: none'
          ref='fileInput'
          accept='image/*'
          @change='onFilePicked'
        >
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FileList',
  data: () => ({
    headers: [
      {
        text: 'FileName',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'DownloadUri', value: 'downloadUri' },
      { text: 'Type', value: 'type' },
      { text: 'Size', value: 'size' },
      { text: 'Created', value: 'createdAt' },
      { text: 'Updated', value: 'updatedAt' }
    ],
    files: []
  }),
  mounted () {
    this.loadFiles()
  },
  methods: {
    uploadFile (file) {
      let data = new FormData()
      data.append('file', file)
      // data.append('email', this.email)
      const headers = new Headers({
        'Content-Type': 'multipart/form-data'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/uploadFile', {
        method: 'POST',
        // headers: headers,
        body: data
      })
        .then(response => {
          // this.loadAvatar()
        })
        .catch(error => {
          console.log(error)
        })
    },
    onFilePicked (event) {
      const files = event.target.files // file info load
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        // filename 유효성 검사
        return alert('Please pick valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.uploadFile(files[0])
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    loadFiles () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
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
            console.log(json[0])
            console.log(json[0].createdAt)
            console.log(json[0].updatedAt)
            this.files = json
          })
        )
        .catch(error => {
          console.log(error)
        })
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
