  <template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm12 md12>
      <v-card class="pa-3 ma-1">
        <div  v-for="message of received_messages" :key="message.id">
        <tr>
          <td class="pa-1">{{ message.sender }}</td>
          <td class="pa-1">{{ message.content }}</td>
        </tr>
        <v-divider></v-divider>
        </div>
        <v-text-field v-model="send_message" @keydown.enter="sendMessage"></v-text-field>
      </v-card>
    </v-flex>
  </v-layout>
</template>

  <script>
import SockJS from 'sockjs-client'
// import Stomp from '@stomp/stompjs/esm5'
// import io from 'socket.io-client'
// import client from '@stomp/stompjs/esm5/client'
import Stomp from 'webstomp-client'

export default {
  name: 'Chatting',
  data: () => ({
    email: localStorage.email,
    stompClient: null,
    received_messages: [],
    send_message: null,
    connected: false
  }),
  mounted () {
    this.connect()
  },
  methods: {
    connect () {
      // this.socket = io('http://localhost:8080/ws')
      this.socket = new SockJS('http://localhost:8080/ws')
      // const url = 'http://localhost:8080/ws'
      // const url = 'ws://localhost:61614/stomp'
      // this.stompClient = Stomp.Client(url)
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, this.onConnected, this.errorAlarm)
      // this.stompClient.connect(
      //   {},
      //   frame => {
      //     this.connected = true
      //     console.log(frame)
      //     this.stompClient.subscribe('/topic/public', tick => {
      //       // console.log(tick)
      //       this.received_messages.push(JSON.parse(tick.body).content)
      //     })
      //     this.stompClient.send('/app/chat.addUser',
      //       {},
      //       JSON.stringify({ sender: this.email, type: 'JOIN' })
      //     )
      //   },
      //   error => {
      //     console.log(error)
      //     this.connected = false
      //     this.errorAlarm()
      //   }
      // )
    },
    onConnected () {
      // Subscribe to the Public Topic
      this.stompClient.subscribe('/topic/public', this.onMessageReceived)
      // this.stompClient.subscribe('/topic/public', tick => {
      //   // console.log(tick)
      //   this.received_messages.push(JSON.parse(tick.body).content)
      // })
      // Tell your username to the server
      this.stompClient.send('/app/chat.addUser',
        JSON.stringify({ sender: this.email, type: 'JOIN' },
          {})
      )
    },
    onMessageReceived (payload) {
      const message = JSON.parse(payload.body)
      // console.log('onMessageReceived')
      console.log(message)
      // var messageElement = document.createElement('li')

      if (message.type === 'JOIN') {
        // this.received_messages.push('event-message')
        message.content = message.sender + ' joined!'
        // this.received_messages.push(message.content)
        this.received_messages.push(message)
      } else if (message.type === 'LEAVE') {
        // this.received_messages.push('event-message')
        message.content = message.sender + ' left!'
        // this.received_messages.push(message.content)
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

      // var textElement = document.createElement('p')
      // var messageText = document.createTextNode(message.content)
      // textElement.appendChild(messageText)

      // messageElement.appendChild(textElement)

      // messageArea.appendChild(messageElement)
      // messageArea.scrollTop = messageArea.scrollHeight
    },
    sendMessage () {
      // var messageContent = messageInput.value.trim()
      console.log(this.send_message && this.stompClient)
      console.log(this.send_message)
      console.log(this.stompClient)
      if (this.send_message && this.stompClient) {
        var chatMessage = {
          sender: this.email,
          // content: messageInput.value,
          content: this.send_message,
          type: 'CHAT'
        }
        console.log(chatMessage)
        this.stompClient.send('/app/chat.sendMessage', JSON.stringify(chatMessage), {})
        this.send_message = ''
      }
      // event.preventDefault()
    },
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.connected = false
    },
    tickleConnection () {
      this.connected ? this.disconnect() : this.connect()
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Could not connect to WebSocket server. Please refresh this page to try again!' }
      this.$emit('setSnackbar', set)
    }
  }
}
  </script>