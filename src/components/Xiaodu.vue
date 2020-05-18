<template>
  <el-form class="ob-form" ref="xiaodu" autoComplete="on" :rules="modelRules" :model="model" label-width="80px" style="width: 90%; margin: 0 auto;">

    <el-form-item label="房间号" prop="roomNo">
      <el-input v-model="model.roomNo" readonly></el-input>
    </el-form-item>
    <el-form-item label="序列号" prop="serialNo">
      <el-input v-model="model.serialNo" placeholder="输入序列号"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    room: {
      type: String,
      default: '101'
    }
  },
  data () {
    return {
      tableLoading: false,
      model: {
        roomNo: this.room,
        serialNo: '',
      },
      modelRules: {
        serialNo: [{ required: true, message: '序列号不能为空', trigger: 'blur' }]
      },
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
