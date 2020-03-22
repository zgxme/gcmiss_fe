<template>
  <v-app id="inspire">
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
                    hint="用户名不能大于20位"
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
                    hint="密码不能少于6位"
                  />

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="register"
                >注册账号</v-btn>
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="login"
                >立即登陆</v-btn>
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
      rules: {
        nameRules: [
          v => !!v || '用户名不为空',
          v => (v && v.length <= 20) || '用户名不能大于20位'
        ],
        passwordRules: [
          v => !!v || '密码不为空',
          v => (v && v.length >= 6) || '密码不能少于6位'
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
    login: function () {
      // console.log(this.nickname, this.email)
      let _this = this
      _this.$axios.post('/api/v1/user/login',
        { 'nickname': this.nickname, 'password': this.password }
      ).then(function (res) {
        let errmsg = res.data.errmsg
        if (errmsg === 'success') {
          // console.log('登陆成功')
          _this.$router.push({ path: '/' })
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
