<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-text>
          <v-text-field id='inputID' label='ID' v-model='usernameOrEmail'></v-text-field>
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
  name: 'Login',
  data: () => ({
    usernameOrEmail: null,
    password: null
  }),
  mounted () {},
  methods: {
    buttonLogin () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })
      // fetch('http://192.168.137.59:8080/Alpha/api/auth/signin', {
      fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          usernameOrEmail: this.usernameOrEmail,
          password: this.password
        })
      })
        .then(response => {
          if (response.ok) {
            // localStorage.setItem('accessToken', response.accessToken)
            this.$router.push('/test')
            return console.log(response.json())
          }
        })
        .then(json => {})
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
