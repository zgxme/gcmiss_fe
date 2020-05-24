<template>
  <v-app id="inspire">
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
            正在注册中,请稍等
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="colorValue"
      :label="colorValue"
      :value="colorValue"
    >
      {{ text }}
      <v-btn
        text
        @click="snackbar = false"
      >
        我知道了
      </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="snackbar_err"
      :timeout="timeout"
      :color="colorValue"
      :label="colorValue"
      :value="colorValue"
    >
      {{ text_err}}
      <v-btn
        text
        @click="snackbar_err = false"
      >
        我知道了
      </v-btn>
    </v-snackbar>
    <v-content>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>注册</v-toolbar-title>
                <v-spacer />

              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  :lazy-validation="lazy"
                >
                  <v-text-field
                    label="请输入用户名"
                    :counter="20"
                    :rules="rules.nameRules"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    required
                    v-model="nickname"
                  />

                  <v-text-field
                    id="password"
                    label="请输入密码"
                    name="password"
                    :rules="rules.passwordRules"
                    prepend-icon="lock"
                    type="password"
                    required
                    v-model="password"
                  />
                  <v-text-field
                    id="confirmPassword"
                    label="请重复输入密码"
                    name="confirmPassword"
                    :rules="[passwordConfirmationRule]"
                    prepend-icon="lock"
                    type="password"
                    required
                    v-model="confirmPassword"
                    @update:error="checkPassword"
                  />
                  <v-text-field
                    id="email"
                    label="请输入邮箱"
                    name="email"
                    :rules="rules.emailRules"
                    prepend-icon="email"
                    type="email"
                    required
                    v-model="email"
                  />

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="regiser"
                >立即注册</v-btn>
                <v-btn
                  color="primary"
                  @click="login"
                >登录账号</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => (
    {
      nickname: '',
      password: '',
      confirmPassword: '',
      validPassword: '',
      email: '',
      invalid: '',
      valid: true,
      lazy: false,
      snackbar: false,
      snackbar_err: false,
      snackbar_register: false,
      text: '该用户名已经被注册',
      text_err: '该邮箱已经被注册',
      text_register:'正在注册中,请稍等',
      send_dialog:false,
      timeout: 2000,
      colorValue:'red lighten-2',
      rules: {
        nameRules: [
          v => (v.length <= 20 && v.length >= 5 ) || '用户名不能大于20位或小于5位且不含空格',
          v => (v.split(" ").join("").length === v.length ) || '用户名不能含空格',
        ],
        passwordRules: [
          v => (v.length <= 20 && v.length >= 5 ) || '密码不能大于20位或小于5位且不含空格',
          v => (v.split(" ").join("").length === v.length ) || '密码不能含空格',
        ],
        confirmPasswordRules: [
          v => (v.length <= 20 && v.length >= 5 ) || '密码不能大于20位或小于5位且不含空格',
          v => (v.split(" ").join("").length === v.length ) || '密码不能含空格',
        ],
        emailRules: [
          v => /.+@.+\..+/.test(v) || '请输入正确的邮箱',
          v => (v.split(" ").join("").length === v.length ) || '邮箱不能含空格'
        ]
      }
    }),
   watch: {
    send_dialog (val) {
      if (!val) return

      setTimeout(() => (this.send_dialog = false), 1900)
    },
  },
  methods: {
    set_login_name_exist: function(){
      let _this = this
      _this.snackbar = true
    },
    set_login_email_exist: function(){
      let _this = this
      _this.snackbar_err = true
    },
    set_register: function(){
      let _this = this
    _this.snackbar_register = true
    },
    login: function () {
      let _this = this
      _this.$router.push('/login')
    },
    regiser: function () {
      // //console.log(this.nickname, this.email)
      var _this = this
      _this.$axios.post('/api/v1/user/register',
        { 'nickname': this.nickname, 'password': this.password, 'email':this.email}
      ).then(function (res) {
        let errmsg = res.data.errmsg
        let errno = res.data.errno
        if (errno === 4003){
          _this.set_login_name_exist()
          
        }else if(errno === 4007){
          _this.set_login_email_exist()
        }
        else if(errno === 0){
          _this.send_dialog = true
          setTimeout(function (){
          _this.$router.push({ path: '/' })
          },"2000");
        }
      })
    },
    checkPassword: function (invalid) {
      // correct: false
      if (invalid === true) {
        this.validPassword = false
      } else {
        this.validPassword = true
      }
    },
    validate: function () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    reset: function () {
      this.$refs.form.reset()
    },
    resetValidation: function () {
      this.$refs.form.resetValidation()
    }
  },
  computed: {
    passwordConfirmationRule: function () {
      return () => (this.password === this.confirmPassword) || '密码不一致'
    }
  }

}
</script>
