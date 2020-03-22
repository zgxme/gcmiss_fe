<template>
  <div>
    购物车{{message}}
    <el-button type="primary" v-on:click="func">主要按钮</el-button>
    <el-row :gutter="20" v-for="student in students" :key="student">
      <el-col :span="4"><div class="grid-content bg-purple">{{student.name}}</div></el-col>
      <el-col :span="16"><div class="grid-content bg-purple">{{student.age}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">{{student.sex}}</div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'hello vue',
      students: [
        { name: 'test', age: 2, sex: 'male' },
        { name: 'test1', age: 3, sex: 'male' },
        { name: 'test2', age: 3, sex: 'male' }
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    func () {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  div{
    background-color: beige;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
