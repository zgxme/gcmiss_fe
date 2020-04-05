<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-05 14:18:07
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-04-05 14:54:34
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
                  size="164"
                  tile
                >
                  <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, 4)">
                  <v-list-item-content>
                    <v-list-item-title class="title">Marcus Obrien</v-list-item-title>
                    <v-list-item-subtitle>Network Engineer</v-list-item-subtitle>
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

  }),
  created: function () {
    var _this = this
    _this.id = _this.$route.query.id
    console.log("Profile.vue id", _this.id)
  },

}
</script>

<style >
</style>