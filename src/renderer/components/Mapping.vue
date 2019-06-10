<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <!-- <div id="map" style="width:500px;height:400px;">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY를 넣으시면 됩니다."></script>
      </div> -->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Mapping',
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
    }
  }
}
</script>
