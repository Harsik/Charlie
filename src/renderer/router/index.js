import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Mapping',
      name: 'Mapping',
      component: require('@/components/Mapping').default
    },
    {
      path: '/address',
      name: 'Address',
      component: require('@/components/address').default
    },
    {
      path: '/setting',
      name: 'Setting',
      component: require('@/components/setting').default
    },
    {
      path: '/fileList',
      name: 'FileList',
      component: require('@/components/fileList').default
    },
    {
      path: '/profile',
      name: 'Profile',
      component: require('@/components/profile').default
    },
    {
      path: '/login',
      name: 'Login',
      component: require('@/components/login').default
    },
    {
      path: '/logout',
      name: 'Logout',
      component: require('@/components/logout').default
    },
    {
      path: '/signup',
      name: 'Signup',
      component: require('@/components/Signup').default
    },
    {
      path: '/',
      name: 'welcome-view',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '/inspire',
      name: 'inspire',
      component: require('@/components/InspireView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
