<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-05 00:37:35
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-05 02:46:43
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
                 <div
            style="position:absolute;right:0px;bottom:0px"
            >
            <v-btn
            text
            color="primary"
            @click="commentAdm()"
            v-show="can_edit"
            
          >
          编辑
        </v-btn>
        <v-btn
            text
            color="primary"
            @click="deletePost()"
            v-show="can_delete"
          >
          删除
        </v-btn>
            </div>
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
                <v-list-item :key="comment.comment_id" @click="commentPost(comment.user_from_name,comment.user_from_id,id)">
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
                    ><b>@{{comment.user_to_name}}</b> {{comment.content}}</span>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-card>
        <v-card
          tile
          width="750px"
        >
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="8"
        justify="center"
        class="mx-auto">
         <v-card
          tile
          width="750px"
        >
        <v-btn
            text
            color="primary"
            @click="commentAdm()"
          >
          回复楼主
        </v-btn>
        <span style="font-size: 14px; padding: 10px">添加一条新回复</span><span>@{{comment_title}}</span>
          <v-textarea
            solo
            clearable
            counter
            name="input-7-4"
            label=""
            width="750px"
            v-model="comment_content"
          >
          
          </v-textarea>
          <v-btn
            text
            color="primary"
            @click="commentSent()"
          >
          回复
          </v-btn>
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
    comment_content:"",
    user_for: 0,
    comment_title:"",
    can_delete:false,
    can_edit:false,
    
    

  }),

  created: function () {
    let _this = this
    
    _this.id = _this.$route.query.id
    console.log("Post.vue id", _this.id)
    _this.$axios.get('/api/v1/post/item/get', {
      params: {
        post_id: _this.id,
        cursor: 0,
        limit: 102410241024,
        desc: 1,
        tag: 0,
      }
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
        _this.canDelete()
      }
      console.log(res.data)
      _this.post = res.data.post
      _this.comment_list = res.data.comment_list
      _this.post_images = res.data.image_list
      if (res.data.image_list !== null) {
        _this.image_show = true
      }

       _this.$axios.get('/api/v1/user/get', { params: { user_id: 0 } }).then(function (res) {
          let errno = res.data.errno
            console.log(_this.post.poster_id === res.data.user_info.user_id || res.data.user_info.manager_status === 1)
            console.log(_this.post)
            console.log(res.data.user_info)
            _this.can_delete = ( res.data.user_info.manager_status === true || _this.post.poster_id === res.data.user_info.user_id)
            _this.can_edit = (_this.post.poster_id === res.data.user_info.user_id)
        })
    })
  },
  methods: {
    InitData(){
      let _this = this
      _this.comment_title = ""
      _this.comment_content = ""
      _this.id = _this.$route.query.id
      console.log("Post.vue id", _this.id)
      _this.$axios.get('/api/v1/post/item/get', {
        params: {
          post_id: _this.id,
          cursor: 0,
          limit: 102410241024,
          desc: 1,
          tag: 0,
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
    commentPost(user_to_name,user_to_id, post_id){
      let _this = this
      _this.comment_title =  user_to_name + ' '
      _this.user_for = user_to_id
      window.scrollTo(0, 1024101241024)
    },
    commentAdm(){
      let _this = this
      _this.comment_title =  _this.post.poster_name + ' '
      _this.user_for = _this.post.poster_id
      window.scrollTo(0, 1024101241024)
    },
    commentSent(){
      let _this = this
      _this.user_for = _this.post.poster_id
      
      _this.$axios.post('/api/v1/comment/add',
        { 'user_to': _this.user_for, 'comment': _this.comment_content,'post_id':Number(_this.id),"artical_id":0}
      ).then(function (res) {
        let errmsg = res.data.errmsg
        let errno = res.data.errno
        if (errno === 0){
          window.scrollTo(0, 0)
          _this.InitData()
          
        }
      })
    },
    renderHome() {
      let _this = this
      if (_this.$router.currentRoute.path !== '/') {
        _this.$router.push({ path: '/', query: {} })
      }
    },
    deletePost(){
      let _this = this      
      _this.$axios.post('/api/v1/post/delete',
        { 'post_id': _this.id}
      ).then(function (res) {
        let errmsg = res.data.errmsg
        let errno = res.data.errno
        if (errno === 0){
          _this.renderHome()
        }
      })
    }
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