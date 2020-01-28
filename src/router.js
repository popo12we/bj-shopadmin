import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Welcome from './views/Welcome.vue'
import User from './views/User.vue'
import Cat from './views/Cat.vue'
import Param from './views/Param.vue'
import Goods from './views/Goods.vue'
import GoodsAdd from './views/GoodsAdd.vue'
import Report from './views/Report.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/welcome' },
    // 后期大部分业务路由都是  /home  的子路由
    { path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/reports', component: Report },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/goods', component: Goods },
        { path: '/params', component: Param },
        { path: '/users', component: User },
        { path: '/categories', component: Cat }
      ]
    }
  ]
})

// 路由守卫设置
router.beforeEach((to, from, next) => {
  // 非登录用户，如果访问非登录页面，强制去登录
  var token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
