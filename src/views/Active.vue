<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-05-05 15:18:28
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-10 19:02:02
 -->
<template>
  <v-app id="active">
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
  </v-app>
</template>


<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    id : '',
    snackbar: false,
    text: '激活失败,鉴权失效',
    timeout: 2000,
    colorValue:'red lighten-2',
  }),

  created: function () {
    let _this = this
    
    _this.id = _this.$route.query.id
    _this.$axios.post('/api/v1/user/active', {
        "auth": _this.id,
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        _this.set_active_err()
      }else{
        if (_this.$router.currentRoute.path !== '/') {
          _this.$router.push({ path: '/'})
        }
      }

    })
  },
  methods: {
    set_active_err: function(){
      let _this = this
      _this.snackbar = true
    },
  },
}
</script>

<style >

</style>