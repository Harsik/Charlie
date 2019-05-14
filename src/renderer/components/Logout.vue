<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <!-- <v-card>
        <v-card-text>
          <v-text-field id='inputID' label='Email' v-model='email'></v-text-field>
          <v-text-field id='inputPassWord' label='PassWord' v-model='password'></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color='primary' @click='buttonLogin'>
            <v-icon left>power_settings_new</v-icon>Login
          </v-btn>
        </v-card-actions>
      </v-card>-->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isAuthenticated'],
  name: 'Logout',
  data: () => ({
  }),
  mounted () {
    this.logout()
  },
  methods: {
    logout () {
      localStorage.accessToken = null
      this.$emit('sendAuthentication', false)
      this.$router.push('/login')
      this.logoutSuccessAlarm()
    },
    logoutSuccessAlarm () {
      let set = { color: 'success', text: 'Logout Successful' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
