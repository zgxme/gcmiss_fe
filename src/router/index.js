/*
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2019-12-16 23:20:22
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-23 16:27:28
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register'
import Post from '../views/Post'
import Profile from '../views/Profile'
import Mine from '../views/Mine'
import NoFound from '../views/404.vue'
import Communicate from '../views/Communicate'
import Lose from '../views/Lose.vue'
import Find from '../views/Find.vue'
import Help from '../views/Help.vue'
import Active from '../views/Active.vue'
import Transaction from "../views/Transaction.vue"
import Artical from "../views/Artical.vue"
import Router from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/',name: 'home', component: Home},
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'regiser', component: Register },
  { path: '/post', name: 'post', component: Post },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/find', name: 'find', component: Find},
  { path: '/communicate', name:'communicate', component:Communicate},
  { path: '/help', name:'help', component:Help},
  { path: '/lose', name: 'lose', component: Lose},
  { path: '/transaction', name: 'transaction', component: Transaction},
  { path: '/artical', name: 'artical', component: Artical},
  { path: '/active', name: 'active', component: Active},
  { path: '/mine', name: 'mine', component: Mine},
  { path: '/404', component: NoFound },
  { path: '*', redirect: '/404' },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}