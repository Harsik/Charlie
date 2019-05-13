<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-text>
          <v-text-field id='inputID' label='Email' v-model='email'></v-text-field>
          <v-text-field id='inputPassWord' label='PassWord' v-model='password'></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color='primary' @click='buttonLogin'>
            <v-icon left>power_settings_new</v-icon>Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['currentUser'],
  name: 'Login',
  data: () => ({
    email: null,
    password: null
  }),
  mounted () {},
  methods: {
    buttonLogin () {
      localStorage.email = this.email
      localStorage.password = this.password
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
        .then(response => // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            localStorage.accessToken = json.accessToken
            this.$emit('sendCurrentUser', true)
            // console.log(json.accessToken)
            this.$router.push('/test')
            // return json
          })
        )
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
