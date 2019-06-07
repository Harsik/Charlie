<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm6 md4>
      <v-card class="pa-3 ma-1">
        <div class="headline ma-2">
          <v-layout align-center justify-start>{{ settingText }}</v-layout>
          <v-divider></v-divider>
          <v-switch v-model="isDarkness" label="Set Dark" @change="setDarkness"></v-switch>
        </div>
        <div class="headline ma-2">
          <v-layout align-center justify-start>{{ emailText }}</v-layout>
          <v-divider></v-divider>
          {{ email }}
          <v-switch v-model="isAutoLogin" label="Set AutoLogin" @change="setAutoLogin"></v-switch>
        </div>
        <div class="headline ma-2">
          <v-layout align-center justify-start>{{ versionText }}</v-layout>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isDark'],
  name: 'Setting',
  data: () => ({
    isAutoLogin: false,
    isDarkness: false,
    imageUrl: '',
    valid: true,
    settingText: 'Setting',
    emailText: 'Your email : ',
    versionText: 'Version : 1.0.0',
    email: localStorage.email,
    profile: {
      name: null,
      bio: null,
      company: null,
      address: null
    }
  }),
  mounted () {
    if (localStorage.isDark === 'true') {
      this.isDarkness = true
    }
    if (localStorage.isAutoLogin === 'true') {
      this.isAutoLogin = true
    }
  },
  methods: {
    setAutoLogin () {
      localStorage.isAutoLogin = this.isAutoLogin
    },
    setDarkness () {
      this.$emit('setDark', this.isDarkness)
      localStorage.isDark = this.isDarkness
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
