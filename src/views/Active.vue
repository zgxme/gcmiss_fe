<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zheng Gaoxiong
 * @Date: 2020-05-05 15:18:28
 * @LastEditors: Zheng Gaoxiong
 * @LastEditTime: 2020-05-05 15:33:03
 -->
<template>
  <div class="active">
  </div>
</template>


<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    id : ''
  }),

  created: function () {
    let _this = this
    
    _this.id = _this.$route.query.id
    console.log("auth",_this.id)
    _this.$axios.post('/api/v1/user/active', {
        "auth": _this.id,
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
     
    })
  },
  methods: {
   
  },
}
</script>

<style >

</style>