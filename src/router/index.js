import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import System from '@/components/System.vue'
import SystemCase from '@/components/SystemCase.vue'
import SystemCamera from '@/components/SystemCamera.vue'
import SystemUser from '@/components/SystemUser.vue'
import Securityscreen from '@/components/Securityscreen.vue'
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
      component: System,
      children:[{
        path: 'systemCase',
				component: SystemCase,
				name: 'SystemCase',
				meta: { requiresAuth: true }
      },{
        path: 'systemCamera',
				component: SystemCamera,
				name: 'SystemCamera',
				meta: { requiresAuth: true }
      },{
        path: 'systemUser',
				component: SystemUser,
				name: 'SystemUser',
				meta: { requiresAuth: true }
      }]
    },{
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    },
    {
      path:"/securityscreen",
      name:"securityscreen",
      component:Securityscreen
    }
  ]
})
