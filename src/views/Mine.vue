<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-04-05 14:18:07
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-23 13:32:33
 -->
 <!--
 TODO flush error
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
        <v-card
          max-width="750px"
          tile
        >
        <v-form v-model="valid" ref="form" v-show="can_edit">
        <v-card>
          <v-card-title>
          <span style="font-size:14px">设置个人资料</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-container>
            
            <v-row class="mx-2">
              <v-col
                cols="12"
                style="padding:0px"
              >
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>QQ</span>
              </td>
              <td width="auto" align="left" style="padding:5px">
                <v-text-field
                  v-model="qq_number"
                  clear-icon="cancel"
                  :rules="rules_qq"
                  counter="15"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr>
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>手机号</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="tel_number"
                  clear-icon="cancel"
                  counter="11"
                  :rules="rules_tel_num"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr>
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>真实姓名</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="realname"
                  :rules="rules_name"
                  clear-icon="cancel"
                  counter="10"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr>
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>学号</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="stu_num"
                  clear-icon="cancel"
                  counter="20"
                  solo=""
                  label=""
                  style="padding:5px"
                  dense=""
                  :rules="rules_stu_num"
                ></v-text-field>
              </td>
              </tr>
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>学校</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="school"
                  :rules="rules_school"
                  clear-icon="cancel"
                  counter="10"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr>
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>专业</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="profession"
                  clear-icon="cancel"
                  :rules="rules_profession"
                  counter="10"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr>
              <!-- <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>年级</span>
              </td>
              <td width="auto" align="left">
                <v-text-field
                  v-model="grade"
                  clear-icon="cancel"
                  :rules="rules_grade"
                  counter="20"
                  solo=""
                  label=""
                  dense=""
                ></v-text-field>
              </td>
              </tr> -->
              <tr>
              <td width="100px" align="right" style="padding:5px">
                <span>性别</span>
              </td>
              <td width="auto" align="left">
               <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      v-on="on"
                      text
                      color="primary"
                      
                    >
                    <span>{{sex_tag}}</span>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in sex_items"
                      :key="index"
                      @click="setTag(index)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
              </tr>
              </v-col>
              <v-col
                cols="12"
                style="padding:0px"
              >
    
              </v-col>

            </v-row>
          </v-container>
          <v-card-actions>
            <!-- <tr>
            <td width="100px" align="right" style="padding:5px">
                <span>当前头像</span>
            
            </td>
            <td width="auto" align="left">
              <v-avatar
                  class="profile"
                  color="grey"
                  size="50px"
                  tile
                >
                  
                  <v-img v-bind:src="user_info.avatar_url"></v-img>
                </v-avatar>
            </td>
            </tr>
               -->
           
            <v-file-input
              accept="image/png, image/jpeg, image/jpg"
              placeholder="上传新头像"
              counter
              show-size
              id="demo"
              name="images"
              @change="(e) => view_change()"
            >

            </v-file-input>
            <!-- <v-btn
              text
              color="
                primary"
              @click="dialog = false"
            >取消</v-btn> -->
            <v-btn
              text
              color="primary"
              @click="postInfo()"
              :disabled="!valid"
            >设置</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
        </v-card>
      </v-col>
    </v-row>
    
    
  </v-app>
</template>

<script>
import { compress, compressAccurately } from 'image-conversion';
export default {
  props: {
    source: String
  },
  data: () => ({
    sex_items: [
        { title: '男',tag:0},
        { title: '女',tag:1},
      ],
    sex_tag:'男',
    id: 0,
    user_info: {},
    profile_info: {},
    qq_number: '',
    tel_number: '',
    realname: '',
    stu_num:'',
    school: '',
    profession:'',
    grade:'',
    post_tag:0,
    valid: true,
    filelist: [],
    dialog: false,
    send_dialog:false,
    can_edit:false,
    rules_qq:[v => ((v && v.length <= 15)||(!v)) || '字符限制不超过15位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格', v=> ((v && /^[0-9]*$/.test(v) || (!v)) || '仅包含数字')],
    rules_tel_num:[v => ((v && v.length == 11)||(!v)) || '字符限制11位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格', v=> ((v && /^[0-9]*$/.test(v) ||(!v)) ||  '仅包含数字')],
    rules_name:[v => ((v && v.length <= 10)||(!v)) || '字符限制不超过10位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格'],
    rules_stu_num:[v => ((v && v.length == 8)||(!v)) || '字符限制8位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格', v=> ((v && /^[0-9]*$/.test(v) || (!v)) || '仅包含数字')],
    rules_school:[v => ((v && v.length <= 10)||(!v)) || '字符限制不超过10位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格'],
    rules_profession:[v => ((v && v.length <= 10)||(!v)) || '字符限制不超过10位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格'],
    rules_grade:[v => ((v && v.length <= 10)||(!v)) || '字符限制不超过10位',v =>((v && v.split(" ").join("").length === v.length) ||(!v)) || '不含空格'],
  
  }),
  created: function () {
    var _this = this
    _this.id = _this.$store.state.current_id
    _this.$axios.get('/api/v1/user/get', { params: { user_id: _this.$store.state.current_id } }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        // //console.log(errno)
      }
      _this.user_info = res.data.user_info
      //console.log("user_id",_this.id )
      //console.log("current_id",_this.$store.state.current_id)
      _this.can_edit = (_this.id  == _this.$store.state.current_id)
    })
    _this.$axios.get('/api/v1/user/profile/get', { params: { user_id: _this.id } }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        // //console.log(errno)
      }
      _this.profile_info = res.data.profile_info
    })
  },
 
  editProfile: function(){
    
  },
  methods:{
    InitData() {
      var _this = this
      _this.id = _this.$store.state.current_id
      _this.$axios.get('/api/v1/user/get', { params: { user_id: _this.$store.state.current_id } }).then(function (res) {
        let errno = res.data.errno
        if (errno !== 0) {
          // //console.log(errno)
        }
        _this.user_info = res.data.user_info
      })
      _this.$axios.get('/api/v1/user/profile/get', { params: { user_id: _this.$store.state.current_id } }).then(function (res) {
        let errno = res.data.errno
        if (errno !== 0) {
          // //console.log(errno)
        }
        _this.profile_info = res.data.profile_info
      })
      if (_this.$store.state.current_id === _this.id){
        // _this.set_avatar(_this.user_info.avatar_url)
      }
    },
    setTag(index){
      let _this = this
      //console.log(_this.sex_items[index])
      _this.post_tag = _this.sex_items[index].tag
      _this.sex_tag = _this.sex_items[index].title
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
    postInfo() {
      let formData = new FormData()
      var pList = [];
      let _this = this
      _this.dialog = false
      //console.log(_this.filelist)
      _this.send_dialog = true
      setTimeout(function (){
        formData.append("avatar", _this.filelist[0])
      },"1000");
      
      formData.append('name', _this.realname)
      formData.append('stu_id', _this.stu_num)
      formData.append('school', _this.school)
      formData.append('profession', _this.profession)
      formData.append('sex', _this.post_tag)
      formData.append('qq_number', _this.qq_number)
      formData.append('telnumber', _this.tel_number)      
      //console.log('formData', formData.getAll)
      setTimeout(function (){
        _this.$axios({
        url: '/api/v1/user/update',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then(function (res){
        let errno = res.data.errno
        // _this.profile_info.qq_number = _this.qq_number
        // _this.profile_info.telphone_num = _this.tel_number
        if (errno == 0){
          _this.InitData()
        }
      })
      },"1200");
      
      _this.$refs.form.reset()
      _this.$refs.form.resetValidation()
      _this.valid = true
    }
    
  }

}
</script>

<style >
</style>