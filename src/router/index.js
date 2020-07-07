import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import System from '@/components/System.vue'
import Monitor from '@/components/Monitor.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/system',
      name: 'System',
      component: System
    },{
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    }
  ]
})
