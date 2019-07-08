<template>
  <v-layout align-start justify-center>
    <v-flex xs12 sm6>
      <v-card class="pa-3">
        <!-- <v-form ref="form" v-model="valid" lazy-validation class="pa-3"> -->
          <v-text-field
            label="Receiver"
            v-model="receiver"
            :rules="receiverRules"
            class="pa-3"
            clearable
          ></v-text-field>
          <v-text-field label="Subject" v-model="subject" class="pa-3" clearable></v-text-field>
          <v-textarea label="Text" v-model="text" class="pa-3" clearable auto-grow></v-textarea>
          <div class="pa-2">{{ fileNames }}</div>
          <v-divider></v-divider>
          <v-btn raised class="primary" @click="onPickFile">Upload</v-btn>
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            accept="*"
            @change="onFilePicked"
            multiple
            required
          />
          <v-btn color="primary" :disabled="!valid" @click="onSendMail">
            <v-icon left>email</v-icon>Send
          </v-btn>
          <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
        <!-- </v-form> -->
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { sendEmail } from './APIUtils'

export default {
  name: 'Login',
  data: () => ({
    files: [],
    fileNames: [],
    fileUrl: null,
    subject: null,
    text: null,
    receiver: null,
    isLoading: false,
    valid: true,
    sender: localStorage.email,
    password: null,
    receiverRules: [
      v => !!v || 'Receiver is required',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'Email must be valid'
    ]
  }),
  methods: {
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      this.files = event.target.files // file info load
      this.fileNames[0] = this.files[0].name
      if (this.fileNames[0].lastIndexOf('.') <= 0) { // filename 유효성 검사
        return alert('Please pick valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.fileUrl = fileReader.result
      })
      fileReader.readAsDataURL(this.files[0])
    },
    onSendMail () {
      this.isLoading = true
      let emailRequest = {
        sender: this.sender,
        receiver: this.receiver,
        subject: this.subject,
        text: this.text
      }
      let formData = new FormData()
      console.log(this.files[0].path)
      formData.append('filePath', this.files[0].path)
      // formData.append('file', this.files[0])
      // console.log(this.files[0])
      console.log(emailRequest)
      formData.append('mail', emailRequest)
      // formData.append('sender', this.sender)
      // formData.append('receiver', this.receiver)
      // formData.append('subject', this.subject)
      // formData.append('text', this.text)
      console.log(formData)
      sendEmail(formData)
        .then(response => {
          this.isLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
        })
    },
    errorAlarm () {
      const set = { color: 'error', text: 'Sever error' }
      this.$emit('setSnackbar', set)
    }
  }
}
</script>
