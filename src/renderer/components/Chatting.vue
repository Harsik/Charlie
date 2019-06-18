<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm12 md12>
      <div>
        <div id="main-content" class="container">
          <div class="row">
            <div class="col-md-6">
              <form class="form-inline">
                <div class="form-group">
                  <label for="connect">WebSocket connection:</label>
                  <button
                    id="connect"
                    class="btn btn-default"
                    type="submit"
                    :disabled="connected == true"
                    @click.prevent="connect"
                  >Connect</button>
                  <button
                    id="disconnect"
                    class="btn btn-default"
                    type="submit"
                    :disabled="connected == false"
                    @click.prevent="disconnect"
                  >Disconnect</button>
                </div>
              </form>
            </div>
            <div class="col-md-6">
              <form class="form-inline">
                <div class="form-group">
                  <label for="name">What is your name?</label>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    v-model="send_message"
                    placeholder="Your name here..."
                  >
                </div>
                <button id="send" class="btn btn-default" type="submit" @click.prevent="send">Send</button>
              </form>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table id="conversation" class="table table-striped">
                <thead>
                  <tr>
                    <th>Greetings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in received_messages" :key="item">
                    <td>{{ item }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import SockJS from 'sockjs-client'
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
    send () {
      // console.log('Send message:' + this.send_message)
      if (this.stompClient && this.stompClient.connected) {
        const msg = { type: 'JOIN', sender: this.email, content: this.send_message }
        this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(msg))
      }
    },
    connect () {
      this.socket = new SockJS('http://localhost:8080/ws')
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

      // Tell your username to the server
      this.stompClient.send('/app/chat.addUser',
        {},
        JSON.stringify({ sender: this.email, type: 'JOIN' })
      )
    },
    onMessageReceived (payload) {
      const message = JSON.parse(payload.body)
      // console.log('onMessageReceived')
      console.log(message)
      // var messageElement = document.createElement('li')

      // if (message.type === 'JOIN') {
      //   messageElement.classList.add('event-message')
      //   message.content = message.sender + ' joined!'
      // } else if (message.type === 'LEAVE') {
      //   messageElement.classList.add('event-message')
      //   message.content = message.sender + ' left!'
      // } else {
      //   messageElement.classList.add('chat-message')

      //   var avatarElement = document.createElement('i')
      //   var avatarText = document.createTextNode(message.sender[0])
      //   avatarElement.appendChild(avatarText)
      //   avatarElement.style['background-color'] = getAvatarColor(message.sender)

      //   messageElement.appendChild(avatarElement)

      //   var usernameElement = document.createElement('span')
      //   var usernameText = document.createTextNode(message.sender)
      //   usernameElement.appendChild(usernameText)
      //   messageElement.appendChild(usernameElement)
      // }

      // var textElement = document.createElement('p')
      // var messageText = document.createTextNode(message.content)
      // textElement.appendChild(messageText)

      // messageElement.appendChild(textElement)

      // messageArea.appendChild(messageElement)
      // messageArea.scrollTop = messageArea.scrollHeight
    },
    sendMessage (event) {
      // var messageContent = messageInput.value.trim()
      if (this.send_message && this.stompClient) {
        var chatMessage = {
          sender: this.email,
          // content: messageInput.value,
          content: this.send_message,
          type: 'CHAT'
        }
        this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
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