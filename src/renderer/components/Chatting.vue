  <template>
  <v-layout align-start justify-center row>
    <v-flex fill-height>
      <v-card
        id="container"
        class="pa-3 ma-1"
        style="overflow-y: auto;"
        :style="{
            'height': `${chatHeight}`
     }"
      >
        <div v-for="message of received_messages" :key="message.id">
          <div v-if="message.sender !== email">
            <v-layout align-center justify-start row>
              <v-avatar
                v-if="message.avatarUrl !== null"
                :tile="false"
                :size="30"
                color="grey lighten-4"
              >
                <img :src="message.avatarUrl" alt="avatar" />
              </v-avatar>
              <div class="pa-2">{{ message.sender }}</div>
              <!-- <v-divider vertical></v-divider> -->
              <div class="pa-2">{{ message.content }}</div>
            </v-layout>
          </div>
          <div v-else>
            <v-flex text-xs-right>
              <div class="pa-2">{{ message.content }}</div>
            </v-flex>
          </div>
          <v-divider></v-divider>
        </div>
      </v-card>
      <v-spacer></v-spacer>
      <v-card class="pa-3 ma-1" height="20%">
        <v-text-field v-model="message" @keydown.enter="sendMessage"></v-text-field>
      </v-card>
    </v-flex>
  </v-layout>
</template>

  <script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { ipcRenderer } from 'electron'

// const socket = new SockJS('http://localhost:8080/ws')
// const stompClient = Stomp.over(socket)

export default {
  props: ['isChatJoin'],
  name: 'Chatting',
  data: () => ({
    socket: null,
    stompClient: null,
    height: this.imageHeight,
    imageUrl: null,
    email: localStorage.email,
    received_messages: [],
    message: null,
    connected: false
  }),
  mounted () {
    this.connect()
    // if (!this.isChatJoin) {
    //   this.connect()
    //   this.setChatJoin(true)
    // }
  },
  beforeDestroy () {
    this.disconnect()
    // this.connect()
    // if (!this.isChatJoin) {
    //   this.connect()
    //   this.setChatJoin(true)
    // }
  },
  computed: {
    chatHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '220px'
        case 'sm': return '400px'
        case 'md': return '500px'
        case 'lg': return '600px'
        case 'xl': return '800px'
      }
    }
  },
  methods: {
    scrollToEnd () {
      this.$nextTick(function () {
        const container = this.$el.querySelector('#container')
        container.scrollTop = container.scrollHeight
      })
    },
    openChat () {
      ipcRenderer.send('openChat', (event, progress) => {
      })

      // const winUrl = process.env.NODE_ENV === 'development' ? `http://localhost:9080/#/ChatWindow` : `file://${__dirname}/index.html#ChatWindow`

      // this.availableWindows[1] = new BrowserWindow({
      //   x: -8,
      //   y: 0,
      //   height: 500,
      //   width: 500,
      //   useContentSize: true,
      //   show: false
      // })
      // this.availableWindows[1].loadURL(winUrl)
      // this.availableWindows[1].on('closed', () => {
      //   this.availableWindows[1] = null
      // })
    },
    connect () {
      this.socket = new SockJS('http://localhost:8080/ws')
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, this.onConnected, this.errorAlarm)
      // stompClient.connect({}, this.onConnected, this.errorAlarm)
    },
    onConnected () {
      // Subscribe to the Public Topic
      this.stompClient.subscribe('/topic/public', this.onMessageReceived)
      // stompClient.subscribe('/topic/public', this.onMessageReceived)
      // Tell your username to the server
      this.stompClient.send('/app/chat.addUser',
        JSON.stringify({ sender: this.email, type: 'JOIN' },
          {})
      )
      // stompClient.send('/app/chat.addUser',
      //   JSON.stringify({ sender: this.email, type: 'JOIN' },
      //     {})
      // )
    },
    onMessageReceived (payload) {
      const message = JSON.parse(payload.body)
      if (message.type === 'JOIN') {
        message.content = 'joined!'
        this.received_messages.push(message)
        this.connected = true
      } else if (message.type === 'LEAVE') {
        message.content = 'left!'
        this.received_messages.push(message)
      } else {
        this.received_messages.push(message)
        console.log(message)
      }
      this.scrollToEnd()
    },
    sendMessage () {
      if (this.message && this.stompClient) {
        var chatMessage = {
          sender: this.email,
          content: this.message,
          type: 'CHAT'
        }
        // this.stompClient.send('/app/chat.sendMessage', JSON.stringify(chatMessage), {})
        this.stompClient.send('/app/chat.sendMessage', JSON.stringify(chatMessage), {})
        this.message = ''
      }
    },
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.connected = false
      // this.setChatJoin(true)
    },
    setChatJoin (bool) {
      this.$emit('setChatJoin', bool)
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Could not connect to WebSocket server. Please refresh this page to try again!' }
      this.$emit('setSnackbar', set)
    }
  }
}
  </script>