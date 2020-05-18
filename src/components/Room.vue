<template>
  <el-form class="ob-form" ref="room" autoComplete="on" :rules="modelRules" :model="model" label-width="80px" style="width: 90%; margin: 0 auto;">
    <el-form-item label="房间号" prop="roomNo">
      <el-input v-model="model.roomNo" placeholder="输入房间号"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: false,
      model: {
        roomNo: '',
      },
      modelRules: {
        roomNo: [{ required: true, message: '房间号不能为空', trigger: 'blur' }]
      },
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
