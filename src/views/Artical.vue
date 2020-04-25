<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-25 16:06:50
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-04-25 16:07:35
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
                        <v-list-item-avatar
                          @click="renderProfile(post.poster_id)"
                          style="cursor:pointer"
                        >
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
            <v-carousel v-show="image_show">
              <v-carousel-item
                v-for="image in post_images"
                :key="image.image_id"
                :src="image.image_url"
                reverse-transition="fade-transition"
                transition="fade-transition"
                @click="renderImg(image.image_url)"
                style="cursor:pointer"
              ></v-carousel-item>
            </v-carousel>
          </v-window>
          <v-card flat>
            <v-list
              two-line
              subheade
              :disabled=false
            >
              <template v-for="comment in comment_list">
                <v-list-item :key="comment.comment_id">
                  <v-list-item-avatar
                    @click="renderProfile(comment.user_from_id)"
                    style="cursor:pointer"
                  >
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
    post_images: [],
    image_show: false,

  }),

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
      _this.post_images = res.data.image_list
      if (res.data.image_list !== null) {
        _this.image_show = true
      }
    })
  },
  methods: {
    renderProfile(user_id) {
      let _this = this
      if (_this.$router.currentRoute.path !== '/profile' && user_id != 0) {
        _this.$router.push({ path: '/profile', query: { id: user_id } })
      }
    },
    renderImg(url) {
      // window.open(url, 'target')
      window.location.href = url
    },
  },
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