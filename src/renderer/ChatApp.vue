<template>
  <div id="app">
    <v-app :dark="isDark">
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

  <script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
  name: 'Chatting',
  data: () => ({
    isDark: false,
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

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons");
/* Global CSS */
</style>
