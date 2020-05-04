<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-25 22:13:23
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-03 10:02:14
 -->
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
                <!-- <v-divider
                  :key="index"
                  inset
                ></v-divider> -->
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
              placeholder="请添加少于5张图片"
              prepend-icon="mdi-camera"
              multiple
              counter
              show-size
              id="uoloadFiles"
              name="images"
            >
            <input
              type="file"
              multiple
              @change="upfile($event)"
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
export default {
  props: {
    source: String
  },
  name: 'home',
  data: () => ({
    dialog: false,
    post_items: [],
    REQUIRE: true,
    loading: false,
    tips: '努力加载中...',
    cursor: 20,
    limit: 10,
    has_more: true,

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
  created: function () {
    var _this = this
    //TODO fix sort 
    _this.$axios.get('/api/v1/post/get', {
      params: {
        cursor: 0,
        limit: 20,
        desc: 1,
        tag: 0,
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
              tag: 0,
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
          tag: 0,
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
    postInfo() {
      let _this = this
      _this.dialog = false
      _this.formData = new FormData()
      // let files = document.querySelector('input[type=file]').files
      // console.log(files)
      // await _this.changeimg(files)
      // console.log(_this.filelist)
      for (let i = 0; i < _this.filelist; i++) {
        console.log(_this.filelist[i])
        _this.formData.append("images", filelist[i])
      }
      _this.formData.append('title', _this.title)
      _this.formData.append('content', _this.content)
      console.log('formData', _this.formData.getAll)
      _this.$axios({
        url: '/api/v1/post/add',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: _this.formData
      }).then((response) => {
        _this.InitData()
      })
    },
    async changeimg(files) {
      var _this = this
      console.log(files)
      for (let i = 0; i < files.length; i++) {
        console.log(files[i])
        await _this.uploadSectionFile(files[0]);
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      // 		铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6://需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8://需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3://需要180度旋转
            this.rotateImg(img, 'right', canvas);//转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);

      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log("ndata:" + ndata)

      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

      console.log(ndata)
      return ndata;
    },
    async uploadSectionFile(f) { //	附件上传
      let self = this;
      let Orientation;
      let ndata;

      if (f.size <= 1 * 1024 * 1024) {
        //判断图片是否大于1M,是就直接上传
        ndata = f;
        self.postImg(ndata);
      } else {
        //反之压缩图片
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        console.log('-----------------f', f)
        reader.readAsDataURL(f);
        console.log(reader)
        // 读取成功后的回调
        let result = this.result;
        let img = new Image();
        img.src = result;
        let data = await self.compress(img, Orientation);
        self.headerImage = data;
        ndata = await self.compress(img, Orientation);

        //BASE64转图片
        var arr = await ndata.split(','), mime = await arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        console.log("arr-----------", arr)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        ndata = new File([u8arr], f.name, { type: mime })
        console.log("ndata----------------", ndata)

        await self.postImg(ndata);
      }
    },
    postImg(ndata) {
      var _this = this
      console.log(ndata)
      _this.filelist.push(ndata)
    },
    upfile(event) {
      var files = event.target.files
      for (let i; i < files.length; i++) {
        var file = event.target.files[i]
        var name = event.target.files[i].name;
        lrz(file).then(rst => { //压缩图片
          file = rst.file;
          let file = new window.File([file], name, {
            type: file.type
          }) //把blob转化成file
          this.filelist.push(file)
        });
        console.log(this.filelist)
      }
    },
    mounted() {
      this.scroll(this.post_items)
    },
    // 压缩图片
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