<template>
  <v-layout align-start justify-center row wrap>
    <v-flex xs12 sm6 md4>
      <v-card class="pa-3 ma-1">
        <div class="headline">
          <v-layout align-center justify-start>{{ settingText }}</v-layout>
          <v-divider></v-divider>
        </div>
        <v-form class="pa-3" ref="form" v-model="valid" lazy-validation>
          <v-switch v-model="isDarkness" label="Set Dark" @change="setDarkness"></v-switch>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isDark'],
  name: 'Setting',
  data: () => ({
    isDarkness: true,
    imageUrl: '',
    valid: true,
    settingText: 'Setting',
    email: localStorage.email,
    profile: {
      name: null,
      bio: null,
      company: null,
      address: null
    }
  }),
  mounted () {
  },
  methods: {
    setDarkness () {
      this.$emit('setDark', this.isDarkness)
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
