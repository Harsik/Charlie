<template>
  <v-layout align-center justify-center>
    <v-flex>
      <img src="/static/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="text-xs-center">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <!-- <input v-model.lazy="term" v-debounce="delay" placeholder="Search for something" />
      {{ this.term }} -->
    </v-flex>
  </v-layout>
</template>

<script>
// export default {
//   name: 'example',
//   data () {
//     return {
//       delay: 100,
//       term: ''
//     }
//   },
//   watch: {
//     term () {
//       // Do something with search term after it debounced
//       console.log(`Search term changed to ${this.term}`)
//     }
//   },
//   directives: {
//     debounce
//   }
// }
</script>
<style scoped>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>