<template>
  <v-container fluid grid-list-md>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm6 md4>
      <v-card class='pa-3'>
        <div class='headline'>
          <v-layout align-center justify-start>{{ avatarText }}</v-layout>
          <v-divider></v-divider>
          <v-layout class='pa-3' align-center justify-center>
          <v-avatar
          :tile='true'
          :size="100"
          color="grey lighten-4"
          >
          <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
        </v-avatar>
        </v-layout>
        </div>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6 md4>
      <v-card class='pa-3'>
        <div class='headline'>
          <v-layout align-center justify-start>{{ profileText }}</v-layout>
          <v-divider></v-divider>
        </div>
        <v-form class='pa-3' ref='form' v-model='valid' lazy-validation>
          <v-text-field label='Email' v-model='profile.email' :disabled='true'></v-text-field>
          <v-text-field label='Name' v-model='profile.name'></v-text-field>
          <v-text-field label='Bio' v-model='profile.bio'></v-text-field>
          <v-text-field label='Company' v-model='profile.company'></v-text-field>
          <v-text-field label='Address' v-model='profile.address'></v-text-field>
          <v-btn color='primary' :disabled='!valid' @click='editProfile'>Edit</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Profile',
  data: () => ({
    profileText: 'Profile',
    avatarText: 'Avatar',
    profile: {
      email: localStorage.email,
      name: null,
      bio: null,
      company: null,
      address: null
    }
  }),
  mounted () {
    this.loadProfile()
  },
  methods: {
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
          email: this.profile.email,
          name: this.profile.name,
          bio: this.profile.bio,
          company: this.profile.company,
          address: this.profile.address
        })
      })
        .then((
          response
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.loadProfile()
          })
        )
        .catch(() => {
        })
    },
    loadProfile () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })

      if (localStorage.accessToken) {
        headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
      }

      fetch('http://localhost:8080/api/account/profile', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: localStorage.email,
          password: ''
        })
      })
        .then((
          response
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.profile = json
          })
        )
        .catch(() => {
          // errorAlarm()
        })
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
