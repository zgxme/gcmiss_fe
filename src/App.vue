<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2019-12-16 23:20:22
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-06-06 20:02:54
 -->
<template>
  <v-app id="inspire">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="colorValue"
      :label="colorValue"
      :value="colorValue"
    >
      {{ text_admin }}
      <v-btn
        text
        @click="snackbar = false"
      >
        我知道了
      </v-btn>
    </v-snackbar>
    <v-navigation-drawer
      v-model="drawer"
      app
      :temporary=true
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link @click="navReq(item.href, item.method)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-1"
      dark=""
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span
          class="hidden-sm-and-down"
          @click="renderHome()"
          style="cursor:pointer"
        >gcmiss<span style="font-size:8px">工程小秘书v1.0(校园交流、失物招领、二手市场)</span></span>

      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="搜索"
        class="hidden-sm-and-down"
      />
      <v-spacer />
      dark
      <v-switch
        v-model="$vuetify.theme.dark"
        style="padding-top: 30px"
        color="indigo"
      ></v-switch>

      <v-btn icon>
        <v-icon @click="renderHome()">mdi-home</v-icon>
      </v-btn>
      <!-- <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn> -->
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-btn
        icon
        large
      >
        <v-avatar
          size="32px"
          item
          @click="renderMine()"
        >
          <v-img
            v-bind:src="$store.state.avatar_url"
            alt="Vuetify"
          />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <div>
        <span style="font-size:10px">2020 Copyright. All Rights Reserved. :) purifiedzheng@gmail.com</span>
      </div>
    </v-footer>
  </v-app>

</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: false,
    snackbar: false,
    text_admin: '请登录后才能查看个人主页',
    timeout: 2000,
    colorValue:'red lighten-2',
    items: [
      { icon: '', text: '首页', href: '', method:'index'},
      { icon: '', text: '校园交流', href: '',method:'communicate'},
      { icon: '', text: '失物招领', href: '', method:'lose'},
      { icon: '', text: '寻物启事', href: '', method:'find'},
      { icon: '', text: '求人办事', href: '', method:'help'},
      { icon: '', text: '二手市场', href:'', method: 'transaction'},
      { icon: '', text: '设置', href:'', method:'setting'},
      { icon: '', text: '注册', href:'/api/v1/user/logout',method:'register'} ,
      { icon: '', text: '登录', href:'/api/v1/user/logout',method:'login'} ,
      { icon: '', text: '登出', href:'/api/v1/user/logout',method:'logout'} ,
    ],
    avatar_url: '',
    current_id: 0,
  }),
  methods: {
    set_avatar(value){
      this.$store.commit('set_avatar',value)
    },
    set_current_id(value){
      this.$store.commit('set_current_id',value)
    },
    getUser(){
      let _this = this
      this.$axios.get('/api/v1/user/get', { params: { user_id: 0 } }).then(function (res) {
        let errno = res.data.errno
          _this.current_id = res.data.user_info.current_id
          _this.set_avatar(res.data.user_info.avatar_url)
          _this.set_current_id(res.data.user_info.user_id)
       })  
    },
    renderHome() {
      let _this = this
      if (_this.$router.currentRoute.path !== '/') {
        _this.$router.push({ path: '/', query: {} })
      }
    },
    renderLogin(){
      let _this = this
      if(_this.$router.currentRoute.path !== '/login'){
        _this.$router.push({ path: '/login' })
      }
    },
    renderProfile() {
      let _this = this
      if (_this.$store.state.current_id != 0) {
        _this.$router.push({ path: '/profile', query: { id: _this.$store.state.current_id } })
      }
    },
    renderLose(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'lose'){
        _this.$router.push({ path: '/lose'})
      }
    },
    renderTransaction(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'transaction'){
        _this.$router.push({ path: '/transaction'})
      }
    },
    renderRegister(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'register'){
        _this.$router.push({ path: '/register'})
      }
    },
    set_auth_not_exist(){
      let _this = this
      _this.snackbar = true
    },
    renderMine(){
      let _this = this
       if (_this.$store.state.current_id === 0){
        _this.set_auth_not_exist()
      }else if (_this.$router.currentRoute.path !== 'mine'){
        _this.$router.push({ path:'/mine'})
      }
    },
    renderComm(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'communicate'){
        _this.$router.push({ path:'/communicate'})
      }
    },
    renderFind(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'find'){
        _this.$router.push({ path:'/find'})
      }
    },
    renderHelp(){
      let _this = this
      if (_this.$router.currentRoute.path !== 'help'){
        _this.$router.push({ path:'/help'})
      }
    },
    navReq(href, method){
      let _this = this
      if (method === 'logout'){
        _this.$axios.post(href, {}).then(function (res) {
          let errno = res.data.errno
          if (errno === 0) {
            _this.renderLogin()
            _this.user_id = 0
            _this.set_avatar("")
          }
        })
      }
      if (method === 'setting'){
        _this.renderMine()
      }
      if (method === 'communicate'){
        _this.renderComm()
      }
      if (method === 'transaction'){
        _this.renderTransaction()
      }
      if (method === 'lose'){
        _this.renderLose()
      }
      if (method === 'login'){
        _this.renderLogin()
      }
      if (method === 'register'){
        _this.renderRegister()
      }
      if (method === 'index'){
        _this.renderHome()
      }
      if (method === 'find'){
        _this.renderFind()
      }
      if (method === 'help'){
        _this.renderHelp()
      }
    }
    
    
  },
  created(){
    this.getUser()
  },
}
</script>
