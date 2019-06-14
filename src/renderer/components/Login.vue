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
        <v-form ref="form" v-model="valid" lazy-validation class="pa-3">
          <v-text-field label="Email" v-model="email" :rules="emailRules" class="pa-3" clearable></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            @keyup.enter="onLogin"
            class="pa-3"
            clearable
          ></v-text-field>
          <v-btn color="primary" :disabled="!valid" @click="onLogin">
            <v-icon left>power_settings_new</v-icon>Login
          </v-btn>
          <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { login } from './APIUtils'

export default {
  name: 'Login',
  data: () => ({
    isLoading: false,
    headerText: 'This is Login Page',
    valid: true,
    email: null,
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
  methods: {
    loginSuccessAlarm () {
      const set = { color: 'success', text: 'Login Successful' }
      this.$emit('setSnackbar', set)
    },
    loginFailAlarm () {
      const set = { color: 'error', text: 'Login Fail' }
      this.$emit('setSnackbar', set)
    },
    onLogin () {
      this.isLoading = true
      localStorage.email = this.email
      // localStorage.password = this.password
      let loginRequest = {
        email: this.email,
        password: this.password
      }
      login(loginRequest)
        .then(response => {
          this.isLoading = false
          localStorage.accessToken = response.accessToken
          this.$emit('sendAuthentication', true)
          this.loginSuccessAlarm()
          this.$router.push('/inspire')
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
          this.loginFailAlarm()
        })
    }
  }
}
</script>
