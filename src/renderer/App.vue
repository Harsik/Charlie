<template>
  <div id="app">
    <v-app :dark="isDark">
      <v-navigation-drawer fixed v-model="drawer" app>
        <v-list>
          <v-list-tile router :to="navMenu.to" :key="i" v-for="(navMenu, i) in navMenus">
            <v-list-tile-action>
              <v-icon v-html="navMenu.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="navMenu.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app :clipped-left="clipped">
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer" :disabled="!isAuthenticated"></v-toolbar-side-icon>
        <v-toolbar-title v-text="appTitle" @click="openWelcome"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="!isAuthenticated">
          <v-btn flat to="/login">Login</v-btn>
          <v-btn flat to="/signup">Signup</v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-if="isAuthenticated">
          <v-layout align-center justify-space-between>
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon large>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="(subMenu, i) in subMenus" :key="i" :to="subMenu.to">
                  <v-list-tile-title>{{ subMenu.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-layout>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view
              @sendAuthentication="setAuthentication"
              @setSnackbar="setSnackbar"
              @setDark="setDark"
            ></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-snackbar
        v-model="snackbar.model"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        :top="true"
      >
        {{ snackbar.text }}
        <v-btn flat @click="snackbar.model = false">Close</v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'Charlie',
  data: () => ({
    isAutoLogin: false,
    isDark: false,
    appTitle: 'UnderSeed',
    isAuthenticated: false,
    clipped: true,
    drawer: false,
    snackbar: { model: false, color: 'success', timeout: 1500, text: '' },
    navMenus: [
      { title: 'Welcome', to: '/' },
      { title: 'Inspire', to: '/inspire' },
      { title: 'FileList', to: '/fileList' },
      { title: 'Address', to: '/address' },
      { title: 'Chatting', to: '/Chatting' }
    ],
    subMenus: [
      { title: 'Profile', to: '/profile' },
      { title: 'Setting', to: '/setting' },
      { title: 'Logout', to: '/logout' }
    ]
  }),
  mounted () {
    this.mountDark()
    this.mountAuth()
  },
  methods: {
    mountAuth () {
      if (localStorage.isAutoLogin === 'true') {
        if (localStorage.accessToken !== null) {
          this.isAuthenticated = true
        }
      }
    },
    mountDark () {
      if (localStorage.isDark === 'true') {
        this.isDark = true
      }
    },
    setDark (bool) {
      this.isDark = bool
    },
    setAuthentication (bool) {
      this.isAuthenticated = bool
    },
    setSnackbar (set) {
      this.snackbar.model = true
      this.snackbar.color = set.color
      this.snackbar.text = set.text
    },
    openWelcome () {
      this.$router.push('/welcome')
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons");
/* Global CSS */
</style>
