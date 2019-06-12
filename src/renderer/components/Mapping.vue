<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card class="pa-3">{{ result }}</v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { REST_API_KEY } from './constants'

export default {
  props: ['isAuthenticated'],
  name: 'Logout',
  data: () => ({
    result: null
  }),
  mounted () {
    this.searchAddress()
  },
  methods: {
    searchAddress () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })

      if (REST_API_KEY) {
        headers.append('Authorization', 'KakaoAK ' + REST_API_KEY)
      }

      fetch('https://dapi.kakao.com/v2/local/search/address.json?query=전북 삼성동 100', {
        method: 'GET',
        headers: headers
      })
        .then((
          response // response.ok 값을 남기기 위해 respoense.json().then으로 다시 출력
        ) =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }
            this.result = json
          })
        )
        .catch(() => {
          this.errorAlarm()
        })
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>