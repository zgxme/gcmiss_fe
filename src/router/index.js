/*
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2019-12-16 23:20:22
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-05 15:24:29
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register'
import Post from '../views/Post'
import Profile from '../views/Profile'
import NoFound from '../views/404.vue'
import Lose from '../views/Lose.vue'
import Transaction from '../views/Transaction.vue'
import Active from '../views/Active.vue'
import Router from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/',name: 'home', component: Home},
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'regiser', component: Register },
  { path: '/post', name: 'post', component: Post },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/lose', name: 'lose', component: Lose},
  { path: '/transaction', name: 'transaction', component: Transaction},
  { path: '/active', name: 'active', component: Active},
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