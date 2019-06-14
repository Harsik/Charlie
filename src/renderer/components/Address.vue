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
      </v-card>
      <div v-html="html"></div>
    </v-flex>
  </v-layout>
</template>

<script>
import { searchAddress } from './APIUtils'
import _ from 'lodash'

export default {
  name: 'Address',
  data: () => ({
    html: null,
    address: [],
    search: null,
    result: null
  }),
  mounted () {
  },
  watch: {
    search: function () {
      this.onSearchAddress()
    }
  },
  methods: {
    onSearchAddress: _.debounce(function () {
      searchAddress(this.search)
        .then(response => {
          this.address = response.documents
        })
        .catch(() => {
          this.errorAlarm()
        })
    }, 500),
    errorAlarm () {
      const set = { color: 'error', text: 'Server error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>