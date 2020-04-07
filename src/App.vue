<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2019-12-16 23:20:22
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-04-06 18:47:27
 -->
<template>
  <v-app id="inspire">
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
            link
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
        label="Search"
        class="hidden-sm-and-down"
      />
      <v-spacer />

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
          @click="renderProfile()"
        >
          <v-img
            v-bind:src="avatar_url"
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
    //
    dialog: false,
    drawer: false,
    items: [
      { icon: 'mdi-contacts', text: 'Contacts' },
      { icon: 'mdi-history', text: 'Frequently contacted' },
      { icon: 'mdi-content-copy', text: 'Duplicates' },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'mdi-plus', text: 'Create label' }
        ]
      },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'More',
        model: false,
        children: [
          { text: 'Import' },
          { text: 'Export' },
          { text: 'Print' },
          { text: 'Undo changes' },
          { text: 'Other contacts' }
        ]
      },
      { icon: 'mdi-settings', text: 'Settings' },
      { icon: 'mdi-message', text: 'Send feedback' },
      { icon: 'mdi-help-circle', text: 'Help' },
      { icon: 'mdi-cellphone-link', text: 'App downloads' },
      { icon: 'mdi-keyboard', text: 'Go to the old version' },
    ],
    avatar_url: '',
    current_id: 0,
  }),
  created: function () {
    var _this = this
    _this.$axios.get('/api/v1/session/get', {}).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        _this.$router.push({ path: '/login' })
      } else {
        _this.$axios.get('/api/v1/user/get', { params: { user_id: 0 } }).then(function (res) {
          let errno = res.data.errno
          if (errno !== 0) {
            console.log(errno)
          }
          _this.current_id = res.data.user_info.user_id
          _this.avatar_url = res.data.user_info.avatar_url

        })
      }
    })
  },
  methods: {
    renderHome() {
      let _this = this
      if (_this.$router.currentRoute.path !== '/') {
        _this.$router.push({ path: '/', query: {} })
      }
    },
    renderProfile() {
      let _this = this
      if (_this.$router.currentRoute.path !== '/profile' && _this.current_id != 0) {
        _this.$router.push({ path: '/profile', query: { id: _this.current_id } })
      }
    }
  }
}
</script>
