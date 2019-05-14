<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-form ref='form' v-model='valid' lazy-validation>
        <v-text-field label='Email' v-model='email' :rules='emailRules' clearable></v-text-field>
        <v-text-field
          label='Password'
          v-model='password'
          :rules='passwordRules'
          type='password'
          hint='At least 8 characters'
          clearable
        ></v-text-field>
        <v-btn color='primary' :disabled='!valid' @click='buttonLogin'>
          <v-icon left>power_settings_new</v-icon>Sign in
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Login',
  data: () => ({
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
    vertifyEmail () {
      console.log('vertifyEmail active')
    },
    loginSuccessAlarm () {
      let set = { color: 'success', text: 'Login Successful' }
      this.$emit('setSnackbar', set)
    },
    loginFailAlarm () {
      let set = { color: 'error', text: 'Login Fail' }
      this.$emit('setSnackbar', set)
    },
    buttonLogin () {
      if (this.$refs.form.validate()) {
        localStorage.email = this.email
        // localStorage.password = this.password
        const headers = new Headers({
          'Content-Type': 'application/json'
        })
        // fetch('http://192.168.137.59:8080/Alpha/api/auth/signin', {
        fetch('http://localhost:8080/api/auth/signin', {
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
              this.$emit('sendAuthentication', true)
              this.loginSuccessAlarm()
              this.$router.push('/test')
            })
          )
          .catch(() => {
            this.loginFailAlarm()
            // console.log(error)
          })
      }
    }
  }
}
</script>
