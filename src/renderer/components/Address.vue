<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm12 md12>
      <v-card class="pa-3">
        <v-toolbar flat color="white">
          <v-toolbar-title>Address</v-toolbar-title>
        </v-toolbar>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-layout align-start row wrap>
          <v-flex v-for="value of address" :key="value.id" xs6 sm6>
            <v-card class="ma-1 pa-3">{{ value.address_name }}</v-card>
          </v-flex>
        </v-layout>
        <!-- <div class='text-xs-center pt-2'>
          <v-pagination v-model='pagination.page' :length='pages'></v-pagination>
        </div>-->
      </v-card>
      <div v-html="html"></div>
    </v-flex>
  </v-layout>
</template>

<script>
import { REST_API_KEY } from './constants'
import _ from 'lodash'

export default {
  props: ['isAuthenticated'],
  name: 'Logout',
  data: () => ({
    html: null,
    address: [],
    search: null,
    result: null
  }),
  mounted () {
    // this.searchAddress()
  },
  watch: {
    search: function () {
      this.searchAddress()
    }
  },
  methods: {
    searchAddress: _.debounce(function () {
      const headers = new Headers({
        'Content-Type': 'application/json'
      })

      if (REST_API_KEY) {
        headers.append('Authorization', 'KakaoAK ' + REST_API_KEY)
      }

      if (this.search) {
        fetch('https://dapi.kakao.com/v2/local/search/address.json?query=' + this.search, {
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
              // console.log(json)
              this.address = json.documents
            })
          )
          .catch(() => {
            this.errorAlarm()
          })
      }
    }, 500),
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>