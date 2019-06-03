<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card class="pa-3">
        <div class="pa-3">
          <v-layout align-center justify-center>
            <v-icon x-large>perm_identity</v-icon>
            <v-spacer></v-spacer>
            <v-layout align-center justify-start>{{ headerText }}</v-layout>
          </v-layout>
          <v-divider inset></v-divider>
        </div>
        <v-form class="pa-3" ref="form" v-model="valid" lazy-validation>
          <v-text-field
            class="pa-3"
            label="Email"
            v-model="email"
            :rules="emailRules"
            :error-messages="errors"
            clearable
            :loading="loadingProgress"
          ></v-text-field>
          <v-text-field
            class="pa-3"
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            hint="At least 8 characters"
            @keyup.enter="login"
            clearable
          ></v-text-field>
          <v-btn color="primary" :disabled="!valid" @click="signup">
            <v-icon left>assignment_ind</v-icon>Sign up
          </v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['isAuthenticated'],
  name: 'Signup',
  data: () => ({
    // value: '',
    loadingProgress: false,
    custom: true,
    headerText: 'This is Signup Page',
    emailAvailable: false,
    loading: true,
    valid: true,
    email: '',
    errors: [],
    password: null,
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
  watch: {
    email: function () {
      this.vertifyEmail()
    }
  },
  computed: {
    // progress () {
    //   return Math.min(100, this.value.length * 10)
    // },
    // color () {
    //   return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    // }
  },
  methods: {
    vertifyEmail: _.debounce(function () {
      this.loadingProgress = true
      fetch(
        'http://localhost:8080/api/account/checkEmailAvailability?email=' +
        this.email,
        {
          method: 'GET'
        }
      )
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.emailAvailable = json.available
            if (json.available) {
              this.errors = []
            } else {
              this.errors = ['Email is already taken']
            }
            this.loadingProgress = false
          })
        )
        .catch(() => {
          this.loadingProgress = false
        }
        )
    }, 300),
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
    },
    signup () {
      if (this.$refs.form.validate()) {
        localStorage.email = this.email
        // localStorage.password = this.password
        const headers = new Headers({
          'Content-Type': 'application/json'
        })
        fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })
          .then((
            response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
          ) =>
            response.json().then(json => {
              if (!response.ok) {
                return Promise.reject(json)
              }
              localStorage.accessToken = json.accessToken
              // this.$emit('sendAuthentication', true)
              this.signupSuccessAlarm()
              this.$router.push('/login')
            })
          )
          .catch(() => {
            this.signupFailAlarm()
            // console.log(error)
          })
      }
    }
  }
}
</script>
