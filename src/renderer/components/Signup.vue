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
          <v-icon left>assignment_ind</v-icon>Sign up
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
export default {
  props: ['isAuthenticated'],
  name: 'Login',
  watch: {
    // 질문이 변경될 때 마다 이 기능이 실행됩니다.
    email: function (newemail) {
      // this.answer = '입력을 기다리는 중...'
      this.vertifyEmail(newemail)
    }
  },
  created () {
    // this.checkEmail = _.debounce(this.vertifyEmail(), 1000)
  },
  data: () => ({
    valid: true,
    checkEmail: false,
    email: null,
    password: null,
    emailRules: [
      v => !!v || 'Email is required',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid',
      v => this.checkEmail || 'Email is already taken'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be 8 characters at least'
    ]
    // ,showVertifyEmail: _.debounce(vertifyEmail,500)
  }),
  methods: {
    // debouncedQuery: _.debounce(function () { this.query() }, 300),
    vertifyEmail (email) {
      // const headers = new Headers({
      //   Authorization: 'Bearer ' + localStorage.accessToken
      // })
      fetch(
        'http://localhost:8080/api/user/checkEmailAvailability?email=' + email,
        {
          method: 'GET'
          // ,
          // headers: headers
        }
      )
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.heckEmail = json.available
          })
        )
        .catch(() => {})
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
