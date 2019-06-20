  // <template>
  <v-layout align-start justify-center row>
    <v-flex fill-height>
      <!-- <v-container fluid column wrap height="80%" style="overflow-y: auto;">
            <v-flex
               v-for="message of received_messages" :key="message.id"
            >
              <v-card flat tile v-if="message.sender !== email">
                <v-flex text-xs-left>
              <v-avatar :tile="false" :size="30" color="grey lighten-4">
                <img :src="message.avatarUrl" alt="avatar">
              </v-avatar>
              <div class="pa-2">{{ message.sender }}</div>
              <v-divider vertical></v-divider>
              <div class="pa-2">{{ message.content }}</div>
            </v-flex>
              </v-card>
              <v-card v-else>
            <v-flex text-xs-right>
              <div class="pa-2">{{ message.content }}</div>
            </v-flex>
          </v-card>
          <v-divider></v-divider>
            </v-flex>
      </v-container>-->
      <v-card class="pa-3 ma-1" style="overflow-y: auto;" height="80%">
        <div v-for="message of received_messages" :key="message.id">
          <div v-if="message.sender !== email">
            <v-flex text-xs-left>
              <v-avatar :tile="false" :size="30" color="grey lighten-4">
                <img :src="message.avatarUrl" alt="avatar">
              </v-avatar>
              <div class="pa-2">{{ message.sender }}</div>
              <v-divider vertical></v-divider>
              <div class="pa-2">{{ message.content }}</div>
            </v-flex>
          </div>
          <div v-else>
            <v-flex text-xs-right>
              <div class="pa-2">{{ message.content }}</div>
            </v-flex>
          </div>
          <v-divider></v-divider>
        </div>
      </v-card>
      <v-card class="pa-3 ma-1" height="20%">
        <v-text-field v-model="send_message" @keydown.enter="sendMessage" v-focus></v-text-field>
      </v-card>
    </v-flex>
  </v-layout>
</template>

  <script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
  name: 'Chatting',
  data: () => ({
    imageUrl: null,
    email: localStorage.email,
    stompClient: null,
    received_messages: [],
    send_message: null,
    connected: false
  }),
  mounted () {
    // this.connect()
    // this.openChat()
  },
  methods: {
    connect () {
      this.socket = new SockJS('http://localhost:8080/ws')
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, this.onConnected, this.errorAlarm)
    },
    onConnected () {
      // Subscribe to the Public Topic
      this.stompClient.subscribe('/topic/public', this.onMessageReceived)
      // Tell your username to the server
      this.stompClient.send('/app/chat.addUser',
        JSON.stringify({ sender: this.email, type: 'JOIN' },
          {})
      )
    },
    onMessageReceived (payload) {
      const message = JSON.parse(payload.body)

      if (message.type === 'JOIN') {
        message.content = 'joined!'
        this.received_messages.push(message)
      } else if (message.type === 'LEAVE') {
        message.content = 'left!'
        this.received_messages.push(message)
      } else {
        // this.received_messages.push('chat-message')
        this.received_messages.push(message)
        // this.received_messages.push(message.content)
        // var avatarElement = document.createElement('i')
        // var avatarText = document.createTextNode(message.sender[0])
        // avatarElement.appendChild(avatarText)
        // avatarElement.style['background-color'] = getAvatarColor(message.sender)

        // this.received_messages.push.appendChild(avatarElement)

        // var usernameElement = document.createElement('span')
        // var usernameText = document.createTextNode(message.sender)
        // usernameElement.appendChild(usernameText)
        // messageElement.appendChild(usernameElement)
      }
    },
    sendMessage () {
      if (this.send_message && this.stompClient) {
        var chatMessage = {
          sender: this.email,
          content: this.send_message,
          type: 'CHAT'
        }
        this.stompClient.send('/app/chat.sendMessage', JSON.stringify(chatMessage), {})
        this.send_message = ''
      }
    },
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.connected = false
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Could not connect to WebSocket server. Please refresh this page to try again!' }
      this.$emit('setSnackbar', set)
    }
  }
}
  </script>