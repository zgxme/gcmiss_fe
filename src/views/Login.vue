<template>
  <v-app id="inspire">
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
                <v-toolbar-title>登陆</v-toolbar-title>
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

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="login"
                >立即登陆</v-btn>
                <v-btn
                  color="primary"
                  @click="register"
                >注册账号</v-btn>
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
      text: '请输入正确的用户名或激活当前账号',
      text_err: '请输入正确的密码',
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
          v => !!v || '密码不为空'
        ],
        emailRules: [
          v => !!v || '邮箱不为空',
          v => /.+@.+\..+/.test(v) || '请输入正确的邮箱'
        ]
      }
    }),
  methods: {
    set_login_not_exist: function(){
      let _this = this
      _this.snackbar = true
    },
    set_login_err: function(){
      let _this = this
      _this.snackbar_err = true
    },
    login: function () {
      // console.log(this.nickname, this.email)
      let _this = this
      _this.$axios.post('/api/v1/user/login',
        { 'nickname': this.nickname, 'password': this.password }
      ).then(function (res) {
        let errno = res.data.errno
        if (errno  === 4004){
          _this.set_login_not_exist()
          
        }else if(errno === 4002){
          _this.set_login_err()
        }
        else{
        _this.$router.push({ path: '/',})
        }
      })
    },
    register: function () {
      let _this = this
      _this.$router.push({ path: '/register' })
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
