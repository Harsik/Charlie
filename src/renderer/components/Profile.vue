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
          <v-btn color="primary" :disabled="!valid" @click="onEditProfile">Edit</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { loadAvatar, loadProfile, uploadAvatar, editProfile } from './APIUtils'
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
    this.onLoadProfile()
    this.onLoadAvatar()
  },
  methods: {
    onLoadAvatar () {
      loadAvatar(this.email)
        .then(response => {
          this.imageUrl = response.downloadUri
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onUploadAvatar (file) {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('email', this.email)
      uploadAvatar(formData)
        .then(response => {
          this.onLoadAvatar()
        })
        .catch(error => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onFilePicked (event) {
      const files = event.target.files // file info load
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) { // filename 유효성 검사
        return alert('Please pick valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.onUploadAvatar(files[0])
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onEditProfile () {
      const signupRequest = {
        email: this.email,
        name: this.profile.name,
        bio: this.profile.bio,
        company: this.profile.company,
        address: this.profile.address
      }
      editProfile(signupRequest)
        .then(response => {
          this.onLoadProfile()
        })
        .catch((error) => {
          console.log(error)
          this.errorAlarm()
        })
    },
    onLoadProfile () {
      loadProfile(this.email)
        .then(response => {
          this.profile = response
        })
        .catch((error) => {
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
