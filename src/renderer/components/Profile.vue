<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card class='pa-3'>
        <div class='headline'>
          <v-layout align-center justify-start>{{ headerText }}</v-layout>
          <v-divider></v-divider>
        </div>
        <v-form class='pa-3' ref='form' v-model='valid' lazy-validation>
          <v-text-field label='Email' v-model='profile.email' :disabled='true'></v-text-field>
          <v-text-field label='Name' v-model='profile.name'></v-text-field>
          <v-text-field label='Bio' v-model='profile.bio'></v-text-field>
          <v-text-field label='Company' v-model='profile.company'></v-text-field>
          <v-text-field label='Address' v-model='profile.address'></v-text-field>
          <v-btn color='primary' :disabled='!valid'>Edit</v-btn>
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
    headerText: 'Profile',
    profile: {
      email: localStorage.email,
      name: null,
      bio: null,
      company: null,
      address: null
    },
    valid: true,
    emailRules: [
      v => !!v || 'Email is required',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'Email must be valid'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be 8 characters at least'
    ]
  }),
  mounted () {
    this.loadProfile()
  },
  methods: {
    loadProfile () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      fetch('http://localhost:8080/api/account/profile', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: localStorage.email,
          password: ''
        })
      })
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            // localStorage.accessToken = json.accessToken
            // this.$emit('sendAuthentication', true)
            // this.signupSuccessAlarm()
            this.profile = json
            this.$router.push('/login')
          })
        )
        .catch(() => {
          // this.signupFailAlarm()
          // console.log(error)
        })
    },
    signupSuccessAlarm () {
      const set = { color: 'success', text: 'Signup Successful' }
      this.$emit('setSnackbar', set)
    },
    signupFailAlarm () {
      const set = { color: 'error', text: 'Signup Fail' }
      this.$emit('setSnackbar', set)
    },
    emaillNotAbleAlarm () {
      const set = { color: 'error', text: 'Email is already taken' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
