<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-05 14:18:07
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-04-05 23:35:05
 -->
<template>
  <v-app id="Profile">
    <v-row>
      <v-col
        cols="12"
        sm="8"
        justify="center"
        class="mx-auto"
      >
        <v-card
          max-width="750px"
          tile
        >
          <v-img height="100%">
            <v-row
              align="end"
              class="fill-height"
            >
              <v-col
                align-self="start"
                class="pa-0"
                cols="12"
              >
                <v-avatar
                  class="profile"
                  color="grey"
                  size="150"
                  tile
                >
                  <v-img v-bind:src="user_info.avatar_url"></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, 4)">
                  <v-list-item-content>
                    <v-list-item-title class="title">{{user_info.nickname}}</v-list-item-title>
                    <v-list-item-subtitle>QQ:{{profile_info.qq_number}}</v-list-item-subtitle>
                    <v-list-item-subtitle>电话:{{profile_info.telphone_num}}</v-list-item-subtitle>
                    <v-list-item-subtitle>邮箱:{{profile_info.email}}</v-list-item-subtitle>

                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    id: 0,
    user_info: {},
    profile_info: {},
  }),
  created: function () {
    var _this = this
    _this.id = _this.$route.query.id
    _this.$axios.get('/api/v1/user/get', { params: { user_id: _this.id } }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
      _this.user_info = res.data.user_info
    })
    _this.$axios.get('/api/v1/user/profile/get', { params: { user_id: _this.id } }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
      _this.profile_info = res.data.profile_info
    })
  },

}
</script>

<style >
</style>