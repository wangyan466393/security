import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import System from '@/components/System.vue'
import SystemCase from '@/components/SystemCase.vue'
import SystemCamera from '@/components/SystemCamera.vue'
import SystemUser from '@/components/SystemUser.vue'
import Securityscreen from '@/components/Securityscreen.vue'
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
				meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },{
        path: 'systemCamera',
				component: SystemCamera,
				name: 'SystemCamera',
				meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },{
        path: 'systemUser',
				component: SystemUser,
				name: 'SystemUser',
				meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      }]
    },{
      path:"/securityscreen",
      name:"securityscreen",
      component:Securityscreen,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
  ]
})
