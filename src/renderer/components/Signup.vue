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
            :loading="isLoading"
          ></v-text-field>
          <v-text-field
            class="pa-3"
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            hint="At least 8 characters"
            @keyup.enter="onSignup"
            clearable
          ></v-text-field>
          <v-btn color="primary" :disabled="!valid" @click="onSignup">
            <v-icon left>assignment_ind</v-icon>Sign up
          </v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { checkEmailAvailability, signup } from './APIUtils'
import _ from 'lodash'

export default {
  name: 'Signup',
  data: () => ({
    isLoading: false,
    headerText: 'This is Signup Page',
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
  methods: {
    vertifyEmail: _.debounce(function () {
      this.isLoading = true
      checkEmailAvailability(this.email)
        .then(response => {
          if (response.available) {
            this.errors = []
          } else {
            this.errors = ['Email is already taken']
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    }, 300),
    onSignup () {
      if (this.$refs.form.validate()) {
        localStorage.email = this.email
        const signupRequest = {
          email: this.email,
          password: this.password
        }
        signup(signupRequest)
          .then(response => {
            localStorage.accessToken = response.accessToken
            this.signupSuccessAlarm()
            this.$router.push('/login')
          })
          .catch((error) => {
            console.log(error)
            this.signupFailAlarm()
          })
      }
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
