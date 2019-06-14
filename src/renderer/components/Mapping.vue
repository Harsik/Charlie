<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm12 md12>
      <div v-html="html"></div>
    </v-flex>
  </v-layout>
</template>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76"></script>
<script>
/* eslint-disable */
var container = document.getElementById('map') 
var options = { center: new daum.maps.LatLng(33.450701, 126.570667),
  level: 3
}
var map = new daum.maps.Map(container, options)
</script>
<script>
import { searchAddress } from './APIUtils'
import _ from 'lodash'

export default {
  name: 'Mapping',
  data: () => ({
    html: '<div id="map" style="width:500px;height:400px;">\n</div>\n<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76">\n</scr' + 'ipt>\n<script> \n var container = document.getElementById("map")\n var options = { \n center: new daum.maps.LatLng(33.450701, 126.570667), \n level: 3 \n }\n var map = new daum.maps.Map(container, options)\n</sc' + 'ript>',
    address: [],
    search: null,
    result: null
  }),
  mounted () {
    // this.html = '<div id="map" style="width:500px;height:400px;">\n</div>'
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