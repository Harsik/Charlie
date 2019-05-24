import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/profile',
    name: 'Profile',
    component: require('@/components/profile').default
  }, {
    path: '/login',
    name: 'Login',
    component: require('@/components/login').default
  }, {
    path: '/logout',
    name: 'Logout',
    component: require('@/components/logout').default
  }, {
    path: '/signup',
    name: 'Signup',
    component: require('@/components/Signup').default
  }, {
    path: '/',
    name: 'welcome-view',
    component: require('@/components/WelcomeView').default
  }, {
    path: '/inspire',
    name: 'inspire',
    component: require('@/components/InspireView').default
  }, {
    path: '/fileList',
    name: 'fileList',
    component: require('@/components/FileList').default
  }, {
    path: '*',
    redirect: '/'
  }]
})
// router.beforeEach((to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/login'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   if (authRequired && !loggedIn) {
//     return next('/login');
//   }

//   next();
// })
