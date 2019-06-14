<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm12 md12>
      <div v-html="html"></div>
      <!-- <component :is="dynamicComponent"/> -->
    </v-flex>
  </v-layout>
</template>

<script>
import { searchAddress } from './APIUtils'
import _ from 'lodash'

export default {
  name: 'Mapping',
  data: () => ({
    html: '<div id="map" style="width:500px;height:400px;">\n</div>\n<script id="srcScript" type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76">\n</scr' + 'ipt>\n<script id="codeScript"> \n var container = document.getElementById("map")\n var options = { \n center: new daum.maps.LatLng(33.450701, 126.570667), \n level: 3 \n }\n var map = new daum.maps.Map(container, options)\n</sc' + 'ript>',
    // html: '<div id="map" style="width:500px;height:400px;">\n</div>\n<script id="srcScript" type="text/javascript">\n</scr' + 'ipt>\n<script id="codeScript"></sc' + 'ript>',
    address: [],
    search: null,
    result: null,
    message: 'message'
  }),
  created () {
    // let ckeditor = document.createElement('srcScript')
    // ckeditor.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76')
    // document.head.appendChild(ckeditor)
  },
  mounted () {
    this.scriptsDone2()
    this.scriptsDone3()
  },
  computed: {
    dynamicComponent: function () {
      return {
        // template: `<div>${this.hashTags(this.message)}</div>`,
        template: `<div>${this.html}</div>`,
        methods: {
          someAction () {
            console.log('Action!')
          }
        }
      }
    }
  },
  watch: {
    search: function () {
      this.onSearchAddress()
    }
  },
  methods: {
    nodeScriptReplace (node) {
      if (this.nodeScriptIs(node) === true) {
        node.parentNode.replaceChild(this.nodeScriptClone(node), node)
      } else {
        var i = 0
        var children = node.childNodes
        while (i < children.length) {
          this.nodeScriptReplace(children[i++])
        }
      }

      return node
    },
    nodeScriptIs (node) {
      return node.tagName === 'SCRIPT'
    },
    nodeScriptClone (node) {
      var script = document.createElement('script')
      script.text = node.innerHTML
      for (var i = node.attributes.length - 1; i >= 0; i--) {
        script.setAttribute(node.attributes[i].name, node.attributes[i].value)
      }
      return script
    },
    scriptsDone4 () {
      this.loadScript('//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76')
        .then((res) => {
          console.log(res)
          // Script is loaded, do something
          /* eslint-disable */
          // var container = document.getElementById('map')
          // var options = {
          //   center: new daum.maps.LatLng(33.450701, 126.570667),
          //   level: 3
          // }
          // var map = new daum.maps.Map(container, options)
        })
        .catch((errr) => {
          console.log(err)
          // Failed to fetch script
        })
    },
    scriptsDone3 () {
      this.nodeScriptReplace(document.getElementsByTagName('body')[0])
    },
    scriptsDone2 () {
      var newScript = document.createElement('script')
      newScript.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=9d9d934e871cf40eb66f5f25f178af76'
      // document.getElementById('srcScript').appendChild(newScript)
      document.body.appendChild(newScript)
    },
    scriptsDone () {
      var DOMContentLoadedEvent = document.createEvent('Event')
      DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
      document.dispatchEvent(DOMContentLoadedEvent)
    },
    hashTags (value) {
      // Replace hash tags with links
      return value.replace(/#(\S*)/g, '<a v-on:click="someAction">#$1</a>')
    },
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