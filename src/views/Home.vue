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
              <template v-for="(item,index) in post_items">

                <v-list-item
                  :key="item.post_id"
                  v-if="item.post_id"
                  @click="renderPost(item.post_id)"
                >
                  <v-list-item-avatar>
                    <v-img :src="item.poster_avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="post-list">
                    <v-list-item-title><span style="font-size:16px">{{item.title}}</span></v-list-item-title>
                    <v-list-item-subtitle><span style="font-size:14px">{{item.content}}</span></v-list-item-subtitle>
                    <v-list-item-subtitle><span style="font-size:12px">{{item.post_lable}}</span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  :key="index"
                  inset
                ></v-divider>
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
      v-model="dialog"
      width="800px"
    >
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
                clearable
                clear-icon="cancel"
                outlined
                label="输入描述,越详细越好"
              ></v-textarea>
            </v-col>
            <!-- <v-row
                align="center"
                class="mr-0"
              >
                <v-avatar
                  size="40px"
                  class="mx-3"
                >
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field placeholder="Name" />
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field placeholder="Job title" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
              />
            </v-col>
            <v-col cols="12"> -->
            <!-- <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              /> -->
          </v-row>
        </v-container>
        <v-card-actions>
          <!-- <v-btn
            text
            color="primary"
          >添加图片</v-btn> -->

          <v-file-input
            :rules="rules"
            accept="image/png, image/jpeg, image/jpg"
            placeholder="请添加图片"
            prepend-icon="mdi-camera"
            multiple
            show-size
            id="uoloadFiles"
            name="images"
          > <input
              type="file"
              multiple
            />
          </v-file-input>

          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="dialog = false"
          >取消</v-btn>
          <v-btn
            text
            color="primary"
            @click="postInfo()"
            :disabled="ConfirmationRule()"
          >发表</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    rules: [
      value => !value || value.size < 3145728 || 'Avatar size should be less than 3 MB!',
    ],
    rules_title: [v => v.length <= 20 || '字数限制20字'],
    rules_conetnt: [v => v.length <= 150 || '字数限制20字'],
    valid: false,
    title: '',
    content: '',
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
    renderPost(post_id) {
      let _this = this
      _this.$router.push({ path: '/post', query: { id: post_id } })
    },
    postInfo() {
      let _this = this
      _this.dialog = false
      let data = new FormData()
      let files = document.querySelector('input[type=file]').files
      for (let i in files) {
        data.append('images', files[i])
      }
      // data.append('images')
      data.append('title', _this.title)
      data.append('content', _this.content)
      _this.$axios({
        url: '/api/v1/post/add',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data
      })
    },
  },
  mounted() {
    this.scroll(this.post_items)
  },
  computed: {
    ConfirmationRule: function () {
      let _this = this
      return () => !(_this.title.length <= 20 && _this.title.length > 0 && _this.content.length <= 150 && _this.content.length > 0)
    }
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