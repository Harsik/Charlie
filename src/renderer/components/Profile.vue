<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm6 md4>
      <v-card class="pa-3 ma-1">
        <div class="headline">
          <v-layout align-center justify-start>{{ avatarText }}</v-layout>
          <v-divider></v-divider>
          <v-layout class="pa-3" align-center justify-center>
            <v-avatar :tile="true" :size="300" color="grey lighten-4">
              <img :src="imageUrl" alt="avatar">
            </v-avatar>
          </v-layout>
          <v-btn raised class="primary" @click="onPickFile">Upload</v-btn>
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            accept="image/*"
            @change="onFilePicked"
          >
        </div>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6 md4>
      <v-card class="pa-3 ma-1">
        <div class="headline">
          <v-layout align-center justify-start>{{ profileText }}</v-layout>
          <v-divider></v-divider>
        </div>
        <v-form class="pa-3" ref="form" v-model="valid" lazy-validation>
          <v-text-field label="Email" v-model="email" :disabled="true"></v-text-field>
          <v-text-field label="Name" v-model="profile.name"></v-text-field>
          <v-text-field label="Bio" v-model="profile.bio"></v-text-field>
          <v-text-field label="Company" v-model="profile.company"></v-text-field>
          <v-text-field label="Address" v-model="profile.address"></v-text-field>
          <v-btn color="primary" :disabled="!valid" @click="editProfile">Edit</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Profile',
  data: () => ({
    imageUrl: '',
    valid: true,
    profileText: 'Profile',
    avatarText: 'Avatar',
    email: localStorage.email,
    profile: {
      name: null,
      bio: null,
      company: null,
      address: null
    }
  }),
  mounted () {
    this.loadProfile()
    this.loadAvatar()
  },
  methods: {
    loadAvatar () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }
      fetch('http://localhost:8080/api/file/loadAvatar?email=' + this.email, {
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
            console.log(json)
            this.imageUrl = json.downloadUri
          })
        )
        .catch(() => {
          // errorAlarm()
        })
    },
    uploadAvatar (file) {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('email', this.email)
      // data.append('email', this.email)
      const headers = new Headers({
        'Content-Type': 'multipart/form-data'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }

      fetch('http://localhost:8080/api/file/uploadAvatar', {
        // fetch('http://localhost:8080/api/file/uploadFile', {
        method: 'POST',
        // headers: headers,
        body: formData
      })
        .then(response => {
          this.loadAvatar()
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
      this.uploadAvatar(files[0])
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    editProfile () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }

      fetch('http://localhost:8080/api/account/profile/edit', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: this.email,
          name: this.profile.name,
          bio: this.profile.bio,
          company: this.profile.company,
          address: this.profile.address
        })
      })
        .then(response =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.loadProfile()
          })
        )
        .catch(() => {
          this.errorAlarm()
        })
    },
    loadProfile () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }

      fetch('http://localhost:8080/api/account/profile?email=' + this.email, {
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
            this.profile = json
          })
        )
        .catch(() => {
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
