<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card class="pa-3">
        <div class="pa-3">
  <v-layout align-center justify-center>
      <v-icon x-large>perm_identity</v-icon>
      <v-spacer></v-spacer>
  <v-layout align-center justify-start>
      {{ headerText }}
  </v-layout>
  </v-layout>
  <v-divider inset></v-divider>
  </div>
      <v-form ref='form' v-model='valid' lazy-validation class="pa-3">
        <v-text-field label='Email' v-model='email' :rules='emailRules' 
          class="pa-3" clearable></v-text-field>
        <v-text-field
          label='Password'
          v-model='password'
          :rules='passwordRules'
          type='password'
          @keyup.enter='login'
          class="pa-3"
          clearable
        ></v-text-field>
        <v-btn color='primary' :disabled='!valid' @click='login'>
          <v-icon left>power_settings_new</v-icon> {{ loginText }}
        </v-btn>
            <v-progress-circular
              v-if="isLoading"
              indeterminate
            ></v-progress-circular>
      </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Login',
  data: () => ({
    isLoading: false,
    loginText: 'Login',
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
    vertifyEmail () {
      console.log('vertifyEmail active')
    },
    loginSuccessAlarm () {
      const set = { color: 'success', text: 'Login Successful' }
      this.$emit('setSnackbar', set)
    },
    loginFailAlarm () {
      const set = { color: 'error', text: 'Login Fail' }
      this.$emit('setSnackbar', set)
    },
    login () {
      this.isLoading = true
      if (this.$refs.form.validate()) {
        localStorage.email = this.email
        // localStorage.password = this.password
        const headers = new Headers({
          'Content-Type': 'application/json'
        })
        // fetch('http://192.168.137.59:8080/Alpha/api/auth/login', {
        fetch('http://localhost:8080/api/auth/login', {
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
              this.isLoading = false
              localStorage.accessToken = json.accessToken
              this.$emit('sendAuthentication', true)
              this.loginSuccessAlarm()
              this.$router.push('/inspire')
            })
          )
          .catch(() => {
            this.loginFailAlarm()
            this.isLoading = false
            // console.log(error)
          })
      }
      // this.loadingProgress = false // 폼이 새로고침됨 이유는 모름 그래서 자동으로 false처리됨
    }
  }
}
</script>
