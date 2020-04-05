<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-05 00:37:35
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-04-05 14:51:26
 -->
<template>
  <v-app id="Post">
    <v-row>
      <v-col
        cols="12"
        sm="8"
        justify="center"
        class="mx-auto"
      >
        <v-card
          tile
          width="750px"
        >
          <v-window
            v-model="window"
            class="elevation-1"
          >
            <v-window-item>
              <v-card flat>
                <v-card-text>
                  <v-row
                    class="mb-4"
                    align="center"
                  >
                    <v-list
                      :two-line=true
                      :disabled=false
                    >
                      <v-list-item class="list-item">
                        <v-list-item-avatar>
                          <v-img :src="post.poster_avatar"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title><span style="font-size:20px">{{post.title}}</span></v-list-item-title>
                          <!-- <v-list-item-subtitle><span style="font-size:14px">444</span></v-list-item-subtitle> -->
                          <v-list-item-subtitle><span style="font-size:12px">{{post.post_lable}}</span></v-list-item-subtitle>
                        </v-list-item-content>

                      </v-list-item>
                    </v-list>
                    <!-- <strong class="title">Title {{ n }}</strong> -->
                    <v-spacer></v-spacer>
                  </v-row>

                  <p style="font-size:15px">{{post.content}}</p>

                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
          <v-card flat>
            <v-list
              two-line
              subheade
              :disabled=false
            >
              <template v-for="comment in comment_list">
                <v-list-item :key="comment.comment_id">
                  <v-list-item-avatar>
                    <v-img :src="comment.user_from_avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="comment-list">
                    <!-- <v-list-item-title><span style="font-size:16px">{{comment.title}}</span></v-list-item-title> -->
                    <v-list-item-title><span style="font-size:12px">{{comment.user_from_name}} <span style="color:grey">{{comment.ctime.substr(0,10)}}</span></span></v-list-item-title>
                    <span
                      class="post-item"
                      style="font-size:14px"
                    >@{{comment.user_to_name}}{{comment.content}}</span>
                    <!-- <v-list-item-subtitle><span style="font-size:12px">{{comment.post_lable}}</span></v-list-item-subtitle> -->
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
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
    dialog: false,
    post_items: [],
    REQUIRE: true,
    loading: false,
    tips: '努力加载中...',
    cursor: 10,
    limit: 20,
    has_more: true,
    id: 0,
    window: 0,
    post: {},
    comment_list: [],
    page: 1,

  }),
  created: function () {
    var _this = this
    //TODO fix sort 
    _this.$axios.get('/api/v1/post/get', {
      params: {
        cursor: 0,
        limit: 20,
        desc: 1
      }
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
      _this.cursor = _this.cursor + 10
      _this.has_more = res.data.has_more
      // console.log(res.data.post_list)
      for (let i in res.data.post_list) {
        _this.post_items.push(res.data.post_list[i])
      }
      // console.log(_this.post_items)

    })
  },
  created: function () {
    let _this = this
    _this.id = _this.$route.query.id
    console.log("Post.vue id", _this.id)
    _this.$axios.get('/api/v1/post/item/get', {
      params: {
        post_id: _this.id,
        cursor: 0,
        limit: 10,
        desc: 1
      }
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
      console.log(res.data)
      // for (let i in res.data.post_list) {
      //   _this.post_items.push(res.data.post_list[i])
      // }
      // console.log(_this.post_items)
      _this.post = res.data.post
      _this.comment_list = res.data.comment_list
    })
  },
  methods: {
    // ...
    scroll(post_item) {
      let isLoading = false
      let _this = this
      window.onscroll = () => {
        // 距离底部200px时加载一次
        let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200
        if (bottomOfWindow && isLoading === false && _this.has_more === true) {
          isLoading = true
          _this.$axios.get('/api/v1/post/get', {
            params: {
              cursor: _this.cursor + 10,
              limit: 10,
              desc: 1
            }
          }).then(response => {
            _this.cursor += 10
            // console.log(response.data.post_list)
            _this.post_items.push(response.data.post_list)
            for (let i in response.data.post_list) {
              if (response.data.post_list[i].post_id !== null) {
                _this.post_items.push(response.data.post_list[i])
              }

            }
            if (response.data.has_more === false)
              _this.has_more = false
            isLoading = false
          })
        }
      }
    },
  },
  mounted() {
    this.scroll(this.post_items)
  }
}
</script>

<style >
.post-item span {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.list-item span {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>