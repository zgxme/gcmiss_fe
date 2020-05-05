<template >
  <v-app id="inspire">
    <v-row>
      <v-col
        cols="12"
        sm="8"
        justify="center"
        class="mx-auto"
      >
        <v-lazy transition="fade-transition">
          <v-card
            class="post-list"
            tile
            width="750px"
          >
            <v-list
              two-line
              subheade
              :disabled=false
            >
              <template v-for="(item) in post_items">

                <v-list-item
                  :key="item.post_id"
                  @click="renderPost(item.post_id)"
                >
                  <v-list-item-avatar>
                    <v-img :src="item.poster_avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="post-list-content">
                    <v-list-item-title><span style="font-size:16px">{{item.title}}</span></v-list-item-title>
                    <v-list-item-subtitle><span style="font-size:14px">{{item.content}}</span></v-list-item-subtitle>
                    <v-list-item-subtitle><span style="font-size:12px">{{item.post_lable}}</span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
    <v-btn
      bottom
      color="indigo"
      dark
      fab
      fixed
      right
      @click="dialog = !dialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
        v-model="send_dialog"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            正在发表中,请稍等
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-form v-model="valid">
        <v-card>

          <v-card-title>
            发布帖子
          </v-card-title>
          <v-divider></v-divider>
          <v-container>
            <v-row class="mx-2">
              <v-col
                cols="12"
                style="padding:0px"
              >
                <v-text-field
                  v-model="title"
                  clearable
                  clear-icon="cancel"
                  :rules="rules_title"
                  counter="20"
                  outlined
                  label="一句话描述你遇到的问题或想分享的主题"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                style="padding:0px"
              >
                <v-textarea
                  v-model="content"
                  :rules="rules_conetnt"
                  clearable
                  clear-icon="cancel"
                  outlined
                  label="输入描述,越详细越好"
                  height="350px"
                ></v-textarea>
              </v-col>
              <div class="text-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <span style="font-size: 14px; color: rgba(0, 0, 0, 0.6);">
                    标签
                    </span>
                    <v-btn
                      dark
                      v-on="on"
                      text
                      color="primary"
                      
                    >
                    <span>{{tag_name}}</span>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="setTag(index)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-row>
          </v-container>
          <v-card-actions>

            <v-file-input
              :rules="rules"
              accept="image/png, image/jpeg, image/jpg"
              placeholder="请添加少于5张图片"
              prepend-icon="mdi-camera"
              multiple
              counter
              show-size
              id="demo"
              name="images"
              @change="(e) => view_change()"
            >

            </v-file-input>

            <v-spacer />
            <v-btn
              text
              color="
                primary"
              @click="dialog = false"
            >取消</v-btn>
            <v-btn
              text
              color="primary"
              @click="postInfo()"
              :disabled="!valid"
            >发表</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-app>
</template>

<script>
import { compress, compressAccurately } from 'image-conversion';
export default {
  props: {
    source: String
  },
  promiseList : [],
  name: 'home',
  data: () => ({
    items: [
        { title: '校园交流',tag:0},
        { title: '失物招领',tag:1},
        { title: '寻物启事',tag:2},
        { title: '求人办事',tag:3 },
      ],
    tag_name:'校园交流',
    dialog: false,
    send_dialog:false,
    post_items: [],
    REQUIRE: true,
    loading: false,
    tips: '努力加载中...',
    cursor: 20,
    limit: 10,
    has_more: true,
    post_tag: 0,

    rules: [
      value => value.length <= 5 || '图片限制5张',
    ],
    rules_title: [v => !!v, v => (v && v.length <= 20 && v.length > 0) || '字数限制20字'],
    rules_conetnt: [v => !!v, v => (v && v.length <= 200 && v.length > 0) || '字数限制200字'],
    valid: true,
    title: '',
    content: '',
    files_num: 0,
    formData: {},
    headerImage: {},
    picValue: {},
    filelist: [],
  }),
  watch: {
    send_dialog (val) {
      if (!val) return

      setTimeout(() => (this.send_dialog = false), 4000)
    },
  },
  created: function () {
    var _this = this
    //TODO fix sort 
    _this.getUser()
    _this.$axios.get('/api/v1/post/get', {
      params: {
        cursor: 0,
        limit: 20,
        desc: 1,
        tag: 0
      }
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }

      for (let i in res.data.post_list) {
        _this.post_items.push(res.data.post_list[i])
      }
    })
  },
  methods: {
    // ...
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
          console.log(res.data.user_info)
          _this.current_id = res.data.user_info.current_id
          _this.set_avatar(res.data.user_info.avatar_url)
          _this.set_current_id(res.data.user_info.user_id)
       })  
    },
    async view_change(){
      this.filelist = []
      const files = document.getElementById('demo').files;
      var promiseList=[]
      for (let i = 0; i < files.length; i++) {
        promiseList.push(new Promise((resolve, reject) => {
          setTimeout(() => {
            this.view(files[i])
          }, Math.random() * 3000);
        }));
      }
      Promise.all(promiseList).then((rspList) => {
      });
      
    },
    async view(file) {
      if (typeof file === 'undefined') {
        return
      }
      const res = await compressAccurately(file, 200)
      await this.filelist.push(res)
    },
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
              cursor: _this.cursor,
              limit: _this.limit,
              desc: 1,
              tag:0
            }
          }).then(response => {
            _this.cursor = _this.cursor + _this.limit
            // console.log(response.data.post_list)
            // _this.post_items.push(response.data.post_list)
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
    renderPost(post_id) {
      let _this = this
      _this.$router.push({ path: '/post', query: { id: post_id } })
    },
    InitData() {
      var _this = this
      _this.post_items = []
      _this.cursor = 20
      _this.limit = 10
      _this.$axios.get('/api/v1/post/get', {
        params: {
          cursor: 0,
          limit: 20,
          desc: 1,
          tag: 0
        }
      }).then(function (res) {
        let errno = res.data.errno
        if (errno !== 0) {
          console.log(errno)
        }
        _this.has_more = res.data.has_more
        // console.log(res.data.post_list)
        for (let i in res.data.post_list) {
          _this.post_items.push(res.data.post_list[i])
        }
        // console.log(_this.post_items)
      })
    },
    setTag(index){
      let _this = this
      console.log(_this.items[index])
      _this.post_tag = _this.items[index].tag
      _this.tag_name = _this.items[index].title
    }
    ,
    postInfo() {
      let formData = new FormData()
      var pList = [];
      let _this = this
      _this.dialog = false
      console.log(_this.filelist)
      _this.send_dialog = true
      setTimeout(function (){
        for (let i = 0; i < _this.filelist.length; i++) {
            formData.append("images", _this.filelist[i])
        }
      },"2900");
      
      formData.append('title', _this.title)
      formData.append('content', _this.content)
      formData.append('tag', _this.post_tag)
      console.log('formData', formData.getAll)
      setTimeout(function (){
        _this.$axios({
        url: '/api/v1/post/add',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then((response) => {
        _this.InitData()
      })
      },"3000");
    },
    mounted() {
      this.scroll(this.post_items)
    },
  }
}
</script>
<style>
.post-list span {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
</style>